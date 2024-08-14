import * as React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {ViewStyleProp} from '../../sharedTypes';

export const DrawerMenuIcon = ({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: ViewStyleProp;
}) => (
  <TouchableOpacity
    style={[{justifyContent: 'center'}, style]}
    onPress={onPress}>
    <IonIcon name="menu" size={32} testID="MAIN.drawer-icon" />
  </TouchableOpacity>
);
