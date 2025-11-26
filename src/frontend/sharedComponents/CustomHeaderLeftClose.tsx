import React from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import {BackHandler} from 'react-native';
import isEqual from 'lodash.isequal';

import {CloseIcon} from './icons';
import {BLACK} from '../lib/styles';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useObservationWithPreset} from '../hooks/useObservationWithPreset';
import {ClientGeneratedObservation} from '../sharedTypes';
import {Observation} from '@comapeo/schema';
import {usePersistedDraftObservation} from '../hooks/persistedState/usePersistedDraftObservation';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

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
  const navigation = useNavigationFromRoot();

  const openBottomSheet = React.useCallback(() => {
    if (observationId) {
      navigation.navigate('ConfirmDiscardChangesBottomSheet', {observationId});
    } else {
      navigation.navigate('ConfirmDiscardObservationBottomSheet');
    }
  }, [navigation, observationId]);

  return observationId ? (
    <HeaderBackEditObservation
      tintColor={tintColor}
      headerBackButtonProps={headerBackButtonProps}
      observationId={observationId}
      openBottomSheet={openBottomSheet}
    />
  ) : (
    <HeaderBackNewObservation
      tintColor={tintColor}
      headerBackButtonProps={headerBackButtonProps}
      openBottomSheet={openBottomSheet}
    />
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
  const attachments = usePersistedDraftObservation(store => store.attachments);
  const draftObservation = usePersistedDraftObservation(store => store.value);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (
        checkEqual(observation, {
          numberOfAttachments: attachments.length,
          edited: draftObservation,
        })
      ) {
        return;
      }

      e.preventDefault();

      openBottomSheet();
    });

    return () => unsubscribe();
  }, [observation, attachments, draftObservation, openBottomSheet, navigation]);

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
    numberOfAttachments,
  }: {
    edited: Observation | ClientGeneratedObservation | null;
    numberOfAttachments?: number;
  },
) {
  if (!edited || !('docId' in edited)) return true;
  // attachments are created right before an observation is made, so we need to check # attachments that are about to be saved
  const {attachments: originalAtts} = original;

  if (originalAtts.length !== numberOfAttachments) return false;

  return isEqual(original, edited);
}
