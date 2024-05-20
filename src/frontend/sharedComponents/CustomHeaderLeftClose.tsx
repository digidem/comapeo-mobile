import React from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {BackHandler} from 'react-native';
import isEqual from 'lodash.isequal';

import {CloseIcon} from './icons';
import {BLACK} from '../lib/styles';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../hooks/useDraftObservation';
import {defineMessages, useIntl} from 'react-intl';
import {useObservationWithPreset} from '../hooks/useObservationWithPreset';
import {ClientGeneratedObservation} from '../sharedTypes';
import {Observation} from '@mapeo/schema';
import {usePersistedDraftObservation} from '../hooks/persistedState/usePersistedDraftObservation';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from './BottomSheetModal';

import ErrorIcon from '../images/Error.svg';
import DiscardIcon from '../images/delete.svg';

const m = defineMessages({
  discardTitle: {
    id: 'AppContainer.EditHeader.discardTitle',
    defaultMessage: 'Discard observation?',
    description: 'Title of dialog that shows when cancelling a new observation',
  },
  discardObservationDescription: {
    id: 'AppContainer.EditHeader.discardObservationDescription',
    defaultMessage:
      'Your Observation will not be saved. This cannot be undone. ',
  },
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
  discardObservationButton: {
    id: 'AppContainer.EditHeader.discardObservationButton',
    defaultMessage: 'Discard Observation',
    description: 'Title of dialog that shows when cancelling observation edits',
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
  const {clearDraft} = useDraftObservation();
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
          openBottomSheet={openSheet}
        />
      )}
      <BottomSheetModal isOpen={isOpen} ref={sheetRef}>
        <BottomSheetContent
          title={
            observationId
              ? formatMessage(m.discardChangesTitle)
              : formatMessage(m.discardTitle)
          }
          description={
            observationId
              ? formatMessage(m.discardChangesDescription)
              : formatMessage(m.discardObservationDescription)
          }
          buttonConfigs={[
            {
              variation: 'filled',
              dangerous: true,
              onPress: handleDiscard,
              text: observationId
                ? formatMessage(m.discardChangesButton)
                : formatMessage(m.discardObservationButton),
              icon: <DiscardIcon />,
            },
            {
              onPress: closeSheet,
              text: formatMessage(m.discardCancel),
              variation: 'outlined',
            },
          ]}
          icon={<ErrorIcon width={60} height={60} style={{marginBottom: 15}} />}
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
  const photos = usePersistedDraftObservation(store => store.photos);
  const draftObservation = usePersistedDraftObservation(store => store.value);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (
        checkEqual(observation, {
          numberOfPhotos: photos.length,
          editted: draftObservation,
        })
      ) {
        return;
      }

      e.preventDefault();

      openBottomSheet();
    });

    return () => unsubscribe();
  }, [observation, photos, draftObservation, openBottomSheet, navigation]);

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
      backImage={() => <HeaderCloseIcon tintColor={tintColor || BLACK} />}
    />
  );
};

function checkEqual(
  original: Observation,
  {
    editted,
    numberOfPhotos,
  }: {
    editted: Observation | ClientGeneratedObservation | null;
    numberOfPhotos?: number;
  },
) {
  if (!editted || !('docId' in editted)) return true;
  // attachments are created right before an observation is made, so we need to check # photos that are about to be saved
  const {attachments: originalAtts, ...orignalNoPhotos} = original;

  if (originalAtts.length !== numberOfPhotos) return false;

  const {attachments, ...edittedNoPhotos} = editted;
  return isEqual(orignalNoPhotos, edittedNoPhotos);
}
