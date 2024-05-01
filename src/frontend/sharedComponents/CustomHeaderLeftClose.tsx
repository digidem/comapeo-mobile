import React from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {BackHandler} from 'react-native';
import isEqual from 'lodash.isequal';

import {CloseIcon} from './icons';
import {BLACK} from '../lib/styles';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useObservationWithPreset} from '../hooks/useObservationWithPreset';
import {ClientGeneratedObservation} from '../sharedTypes';
import {Observation} from '@mapeo/schema';
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
  openDiscardModal: () => void;
} & SharedBackButtonProps;

export const CustomHeaderLeftClose = ({
  tintColor,
  headerBackButtonProps,
  observationId,
  openDiscardModal,
}: CustomHeaderLeftCloseProps) => {
  if (observationId) {
    return (
      <HeaderBackEditObservation
        tintColor={tintColor}
        openDiscardModal={openDiscardModal}
        headerBackButtonProps={headerBackButtonProps}
        observationId={observationId}
      />
    );
  }

  return (
    <HeaderBackNewObservation
      openDiscardModal={openDiscardModal}
      tintColor={tintColor}
      headerBackButtonProps={headerBackButtonProps}
    />
  );
};

const HeaderBackNewObservation = ({
  tintColor,
  headerBackButtonProps,
  openDiscardModal,
}: SharedBackButtonProps & {openDiscardModal: () => void}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        openDiscardModal();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [openDiscardModal]),
  );

  return (
    <SharedBackButton
      headerBackButtonProps={headerBackButtonProps}
      tintColor={tintColor}
      onPress={openDiscardModal}
    />
  );
};

type HeaderBackEditObservationProps = {
  observationId: string;
  openDiscardModal: () => void;
} & SharedBackButtonProps;

const HeaderBackEditObservation = ({
  headerBackButtonProps,
  tintColor,
  openDiscardModal,
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

      openDiscardModal();
    });

    return () => unsubscribe();
  }, [observation, photos, draftObservation, openDiscardModal, navigation]);

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
  if (!editted || !('docId' in editted)) return false;
  // attachments are created right before an observation is made, so we need to check # photos that are about to be saved
  const {attachments: originalAtts, ...orignalNoPhotos} = original;

  if (originalAtts.length !== numberOfPhotos) return false;

  const {attachments, ...edittedNoPhotos} = editted;
  return isEqual(orignalNoPhotos, edittedNoPhotos);
}
