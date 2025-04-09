import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const GpsErrorIcon = () => (
  <View
    style={{
      width: 22,
      height: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: -2,
    }}>
    <View
      style={{
        backgroundColor: 'white',
        width: 15,
        height: 15,
        borderRadius: 7,
      }}
    />
    <Icon
      name="error"
      color="#660000"
      size={22}
      style={{position: 'absolute'}}
    />
  </View>
);

export const GpsSearchingIcon = () => (
  <View
    style={{
      backgroundColor: '#0166FF',
      margin: 1.5,
      borderRadius: 7,
      width: 12,
      height: 12,
    }}
  />
);

export const GpsGoodIcon = () => (
  <View
    style={{
      backgroundColor: '#36F927',
      margin: 1.5,
      borderRadius: 7,
      width: 12,
      height: 12,
    }}
  />
);
