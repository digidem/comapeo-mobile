import * as React from 'react';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';

type HeaderLeftProps = {
  headerBackButtonProps: HeaderBackButtonProps;
};

export const HeaderLeft = ({headerBackButtonProps}: HeaderLeftProps) => {
  const navigation = useNavigationFromRoot();

  const handlePress = React.useCallback(() => {
    navigation.navigate('ConfirmDiscardObservationBottomSheet');
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handlePress();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [handlePress]),
  );

  return (
    <HeaderLeftClose
      onPress={handlePress}
      headerBackButtonProps={headerBackButtonProps}
    />
  );
};
