import {HeaderBackButtonProps} from '@react-navigation/elements';
import {useFocusEffect} from '@react-navigation/native';
import * as React from 'react';
import {BackHandler} from 'react-native';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';

type HeaderLeftProps = {
  headerBackButtonProps: HeaderBackButtonProps;
  trackId: string;
};

export const HeaderLeft = ({
  headerBackButtonProps,
  trackId,
}: HeaderLeftProps) => {
  const navigation = useNavigationFromRoot();

  const navigateToBottomSheet = React.useCallback(() => {
    navigation.navigate('ConfirmTrackDiscardBottomSheet', {trackId});
  }, [navigation, trackId]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigateToBottomSheet();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigateToBottomSheet]),
  );

  return (
    <HeaderLeftClose
      onPress={navigateToBottomSheet}
      headerBackButtonProps={headerBackButtonProps}
    />
  );
};
