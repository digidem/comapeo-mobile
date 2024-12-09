import * as React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {ViewStyleProp} from '../../sharedTypes';

export const DrawerMenuIcon = ({
  onPress,
  style,
  close,
}: {
  onPress: () => void;
  style?: ViewStyleProp;
  close?: boolean;
}) => (
  <TouchableOpacity
    style={[{justifyContent: 'center'}, style]}
    onPress={onPress}>
    <IonIcon
      name={close ? 'close' : 'menu'}
      size={32}
      testID="MAIN.drawer-icon"
    />
  </TouchableOpacity>
);
