import React from 'react';
import {BLACK} from '../lib/styles';
import {HeaderCloseIcon} from './CustomHeaderLeftClose';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {HeaderBackButton} from '@react-navigation/elements';

type HeaderLeftCloseProps = {
  headerBackButtonProps: HeaderBackButtonProps;
  onPress: () => void;
  tintColor?: string;
};

export const HeaderLeftClose = ({
  headerBackButtonProps,
  onPress,
  tintColor,
}: HeaderLeftCloseProps) => {
  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      style={{marginLeft: 0, marginRight: 15}}
      onPress={onPress}
      backImage={() => <HeaderCloseIcon tintColor={tintColor || BLACK} />}
    />
  );
};
