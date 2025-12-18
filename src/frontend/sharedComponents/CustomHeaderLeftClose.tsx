import React from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import {BackHandler} from 'react-native';
import isEqual from 'lodash.isequal';

import {CloseIcon} from './icons';
import {BLACK} from '../lib/styles';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {defineMessages, useIntl} from 'react-intl';
import {useObservationWithPreset} from '../hooks/useObservationWithPreset';
import {ClientGeneratedObservation} from '../sharedTypes';
import {Observation} from '@comapeo/schema';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {
  BottomSheetModalContent,
  BottomSheetModal,
  useBottomSheetModal,
} from './BottomSheetModal';

import ErrorIcon from '../images/Error.svg';
import DiscardIcon from '../images/delete.svg';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../contexts/DraftObservationContext';

const m = defineMessages({
  discardChangesTitle: {
    id: 'AppContainer.EditHeader.discardChangesTitle',
    defaultMessage: 'Discard changes?',
    description: 'Title of dialog that shows when cancelling observation edits',
  },
  discardChangesDescription: {
    id: 'AppContainer.EditHeader.discardChangesDescription',
    defaultMessage: 'Your changes will not be saved. This cannot be undone. ',
  },
  discardCancel: {
    id: 'AppContainer.EditHeader.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
  discardChangesButton: {
    id: 'AppContainer.EditHeader.discardChangesButton',
    defaultMessage: 'Discard changes',
    description: 'Title of dialog that shows when cancelling observation edits',
  },
});

// We use a slightly larger back icon, to improve accessibility
// TODO iOS: This should probably be a chevron not an arrow
export const HeaderCloseIcon = ({tintColor}: {tintColor: string}) => {
  return <CloseIcon color={tintColor} />;
};

interface SharedBackButtonProps {
  tintColor?: string;
  headerBackButtonProps: HeaderBackButtonProps;
  onPress?: () => void;
}

type CustomHeaderLeftCloseProps = {
  observationId?: string;
} & SharedBackButtonProps;

export const CustomHeaderLeftClose = ({
  tintColor,
  headerBackButtonProps,
  observationId,
}: CustomHeaderLeftCloseProps) => {
  const {isOpen, sheetRef, closeSheet, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const {formatMessage} = useIntl();
  const {clearDraft} = useDraftObservationActions();
  const navigation = useNavigationFromRoot();

  const handleDiscard = React.useCallback(() => {
    clearDraft();
    navigation.dispatch(
      CommonActions.reset({index: 0, routes: [{name: 'Home'}]}),
    );
  }, [clearDraft, navigation]);

  return (
    <>
      {observationId ? (
        <HeaderBackEditObservation
          tintColor={tintColor}
          headerBackButtonProps={headerBackButtonProps}
          observationId={observationId}
          openBottomSheet={openSheet}
        />
      ) : (
        <HeaderBackNewObservation
          tintColor={tintColor}
          headerBackButtonProps={headerBackButtonProps}
          openBottomSheet={() =>
            navigation.navigate('ConfirmDiscardObservationBottomSheet')
          }
        />
      )}
      <BottomSheetModal isOpen={isOpen} ref={sheetRef}>
        <BottomSheetModalContent
          title={formatMessage(m.discardChangesTitle)}
          description={formatMessage(m.discardChangesDescription)}
          buttonConfigs={[
            {
              variation: 'filled',
              dangerous: true,
              onPress: handleDiscard,
              text: formatMessage(m.discardChangesButton),
              icon: <DiscardIcon />,
            },
            {
              onPress: closeSheet,
              text: formatMessage(m.discardCancel),
              variation: 'outlined',
            },
          ]}
          icon={<ErrorIcon width={60} height={60} />}
        />
      </BottomSheetModal>
    </>
  );
};

const HeaderBackNewObservation = ({
  tintColor,
  headerBackButtonProps,
  openBottomSheet,
}: SharedBackButtonProps & {openBottomSheet: () => void}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        openBottomSheet();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [openBottomSheet]),
  );

  return (
    <SharedBackButton
      headerBackButtonProps={headerBackButtonProps}
      tintColor={tintColor}
      onPress={openBottomSheet}
    />
  );
};

type HeaderBackEditObservationProps = {
  observationId: string;
  openBottomSheet: () => void;
} & SharedBackButtonProps;

const HeaderBackEditObservation = ({
  headerBackButtonProps,
  tintColor,
  openBottomSheet,
  observationId,
}: HeaderBackEditObservationProps) => {
  const navigation = useNavigationFromRoot();
  const {observation} = useObservationWithPreset(observationId);
  const unsavedAttachments = useDraftObservationState(
    store => store.unsavedAttachments,
  );
  const draftObservation = useDraftObservationState(store => store.value);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (
        checkEqual(observation, {
          edited: draftObservation,
        }) ||
        unsavedAttachments
      ) {
        return;
      }

      e.preventDefault();

      openBottomSheet();
    });

    return () => unsubscribe();
  }, [
    observation,
    unsavedAttachments,
    draftObservation,
    openBottomSheet,
    navigation,
  ]);

  return (
    <SharedBackButton
      headerBackButtonProps={headerBackButtonProps}
      tintColor={tintColor}
    />
  );
};

const SharedBackButton = ({
  headerBackButtonProps,
  tintColor,
  onPress,
}: SharedBackButtonProps) => {
  const navigation = useNavigation();
  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      style={{marginLeft: 0, marginRight: 15}}
      onPress={onPress ? onPress : () => navigation.goBack()}
      testID="OBS.close-icon"
      backImage={() => <HeaderCloseIcon tintColor={tintColor || BLACK} />}
    />
  );
};

function checkEqual(
  original: Observation,
  {
    edited,
  }: {
    edited: Observation | ClientGeneratedObservation | null;
  },
) {
  if (!edited || !('docId' in edited)) return true;

  return isEqual(original, edited);
}
