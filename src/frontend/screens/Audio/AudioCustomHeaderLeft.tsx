import * as React from 'react';
import {
  HeaderBackButton,
  HeaderBackButtonProps,
} from '@react-navigation/elements';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {CloseIcon} from '../../sharedComponents/icons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

export function AudioCustomHeaderLeft({
  duration,
  uri,
  ...headerBackButtonProps
}: HeaderBackButtonProps & {
  duration: number;
  uri: string;
}) {
  const {addAudio} = useDraftObservation();
  const navigation = useNavigationFromRoot();

  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      onPress={() => {
        addAudio({
          uri,
          duration,
          createdAt: Date.now(),
        });
        navigation.replace('AudioSavedBottomSheet');
      }}
      backImage={backImageProps => (
        <CloseIcon color={backImageProps.tintColor} />
      )}
    />
  );
}
