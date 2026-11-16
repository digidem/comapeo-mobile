import React from 'react';
import {View} from 'react-native';
import {LIGHT_GREY} from '../lib/styles';

export const Divider = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: LIGHT_GREY,
      }}
    />
  );
};
