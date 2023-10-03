import React from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {Alert} from 'react-native';

import {CloseIcon} from './icons';
import {BLACK} from '../lib/styles';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../hooks/useDraftObservation';
import {defineMessages, useIntl} from 'react-intl';
import {useObservationQuery} from '../hooks/server/useObservationQuery';

const m = defineMessages({
  discardTitle: {
    id: 'AppContainer.EditHeader.discardTitle',
    defaultMessage: 'Discard observation?',
    description: 'Title of dialog that shows when cancelling a new observation',
  },
  discardConfirm: {
    id: 'AppContainer.EditHeader.discardContent',
    defaultMessage: 'Discard without saving',
    description: 'Button on dialog to cancel a new observation',
  },
  discardChangesTitle: {
    id: 'AppContainer.EditHeader.discardChangesTitle',
    defaultMessage: 'Discard changes?',
    description: 'Title of dialog that shows when cancelling observation edits',
  },
  discardChangesConfirm: {
    id: 'AppContainer.EditHeader.discardChangesContent',
    defaultMessage: 'Discard changes',
    description: 'Button on dialog to cancel observation edits',
  },
  discardCancel: {
    id: 'AppContainer.EditHeader.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
});

// We use a slightly larger back icon, to improve accessibility
// TODO iOS: This should probably be a chevron not an arrow
export const HeaderCloseIcon = ({tintColor}: {tintColor: string}) => {
  return <CloseIcon color={tintColor} />;
};

interface CustomHeaderLeftCloseSharedProps {
  tintColor?: string;
  headerBackButtonProps: HeaderBackButtonProps;
}

type CustomHeaderLeftCloseProps = {
  observationId?: string;
} & CustomHeaderLeftCloseSharedProps;

export const CustomHeaderLeftClose = ({
  tintColor,
  headerBackButtonProps,
  observationId,
}: CustomHeaderLeftCloseProps) => {
  if (observationId) {
    return (
      <HeaderBackEditObservation
        tintColor={tintColor}
        headerBackButtonProps={headerBackButtonProps}
        observationId={observationId}
      />
    );
  }

  return (
    <HeaderBackNewObservation
      tintColor={tintColor}
      headerBackButtonProps={headerBackButtonProps}
    />
  );
};

const HeaderBackNewObservation = ({
  tintColor,
  headerBackButtonProps,
}: CustomHeaderLeftCloseSharedProps) => {
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();

  const {clearDraft} = useDraftObservation();
  const handleCloseRequest = React.useCallback(() => {
    Alert.alert(t(m.discardTitle), undefined, [
      {
        text: t(m.discardConfirm),
        onPress: () => {
          clearDraft();
          navigation.navigate('Home', {screen: 'Map'});
        },
      },
      {text: t(m.discardCancel), onPress: () => {}},
    ]);
  }, [clearDraft, navigation, t]);

  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      onPress={handleCloseRequest}
      style={{marginLeft: 0, marginRight: 15}}
      backImage={() => <HeaderCloseIcon tintColor={tintColor || BLACK} />}
    />
  );
};

type HeaderBackEditObservationProps = {
  observationId: string;
} & CustomHeaderLeftCloseSharedProps;

const HeaderBackEditObservation = ({
  headerBackButtonProps,
  tintColor,
  observationId,
}: HeaderBackEditObservationProps) => {
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();

  const {clearDraft} = useDraftObservation();
  const {data, isLoading} = useObservationQuery(observationId);

  const handleCloseRequest = React.useCallback(() => {
    // if untouched just go back and dont do alert

    Alert.alert(t(m.discardChangesTitle), undefined, [
      {
        text: t(m.discardChangesConfirm),
        onPress: () => {
          clearDraft();
          navigation.goBack();
        },
      },
      {text: t(m.discardCancel), onPress: () => {}},
    ]);
  }, [clearDraft, navigation, t]);

  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      onPress={handleCloseRequest}
      style={{marginLeft: 0, marginRight: 15}}
      backImage={
        isLoading
          ? undefined
          : () => <HeaderCloseIcon tintColor={tintColor || BLACK} />
      }
    />
  );
};
