import React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {DARK_GREY, WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {CreateRecording} from './CreateRecording';
import {ExistingRecording} from './ExistingRecording';
import {useDraftObservation} from '../../hooks/useDraftObservation';

export const MAX_RECORDING_DURATION_MS = 5 * 60_000;

export function Audio({route}: NativeRootNavigationProps<'Audio'>) {
  const {deleteAudio} = useDraftObservation();
  const {uri, isEditing} = route.params ?? {
    existingUri: undefined,
    isEditing: false,
  };
  return (
    <>
      {uri ? (
        <ExistingRecording
          uri={uri}
          onDelete={() => {
            deleteAudio(uri);
          }}
          isEditing={isEditing}
        />
      ) : (
        <CreateRecording isEditing={isEditing} />
      )}
    </>
  );
}

export const navigationOptions: NativeStackNavigationOptions = {
  contentStyle: {backgroundColor: DARK_GREY},
  headerTintColor: WHITE,
  headerShadowVisible: false,
  headerTitle: () => null,
  headerStyle: {backgroundColor: 'transparent'},
  headerTransparent: true,
  headerLeft: props => (
    <CustomHeaderLeft
      tintColor={props.tintColor}
      headerBackButtonProps={props}
    />
  ),
};
