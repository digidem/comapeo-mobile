import React from 'react';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';

import {BackIcon} from './icons';
import {BLACK} from '../lib/styles';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';

// We use a slightly larger back icon, to improve accessibility
// TODO iOS: This should probably be a chevron not an arrow
export const HeaderBackIcon = ({tintColor}: {tintColor: string}) => {
  return <BackIcon color={tintColor} />;
};

interface CustomHeaderLeftProps {
  tintColor?: string;
  headerBackButtonProps: HeaderBackButtonProps;
  onPress?: () => void;
}

export const CustomHeaderLeft = ({
  tintColor,
  headerBackButtonProps,
  onPress,
}: CustomHeaderLeftProps) => {
  const navigation = useNavigationFromRoot();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        onPress ? onPress() : navigation.goBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [onPress, navigation]),
  );

  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      onPress={onPress || (() => navigation.goBack())}
      style={{marginLeft: 0, marginRight: 15}}
      backImage={() => <HeaderBackIcon tintColor={tintColor || BLACK} />}
    />
  );
};
