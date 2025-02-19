import * as React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {ViewStyleProp} from '../../sharedTypes';

export const DrawerMenuIcon = ({
  onPress,
  style,
  testID,
}: {
  onPress: () => void;
  style?: ViewStyleProp;
  testID: string;
}) => (
  <TouchableOpacity
    style={[{justifyContent: 'center'}, style]}
    onPress={onPress}>
    <IonIcon name="menu" size={32} testID={testID} />
  </TouchableOpacity>
);
