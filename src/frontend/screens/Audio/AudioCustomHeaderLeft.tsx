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
  // Now the usage of this hook is co-located to where it's needed and not unnecessarily set up further up the component tree (which potentially introduces rendering overhead)
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
      // eslint-disable-next-line react/no-unstable-nested-components
      backImage={backImageProps => (
        <CloseIcon color={backImageProps.tintColor} />
      )}
    />
  );
}
