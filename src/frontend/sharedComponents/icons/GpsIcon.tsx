import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const ErrorIcon = () => (
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

export const GpsIcon = ({color}: {color: string}) => (
  <View
    style={{
      backgroundColor: color,
      margin: 1.5,
      borderRadius: 7,
      width: 14,
      height: 14,
    }}
  />
);

// export const GpsIcon = React.memo<Props>(GpsIconComponent);
