import React from 'react';
import {View} from 'react-native';
import GreyMap from '../images/grey-map-icon.svg';
import ErrorIcon from '../images/Error.svg';
import {ViewStyleProp} from '../sharedTypes';

export const LogoWithErrorIcon = ({style}: {style?: ViewStyleProp}) => {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          position: 'relative',
          shadowColor: '#000',
          backgroundColor: '#fff',
          borderRadius: 100,
          elevation: 20,
          padding: 40,
        },
        style,
      ]}>
      <GreyMap width={100} height={100} />
      <ErrorIcon
        width={50}
        height={50}
        style={{position: 'absolute', bottom: 0, right: 0}}
      />
    </View>
  );
};
