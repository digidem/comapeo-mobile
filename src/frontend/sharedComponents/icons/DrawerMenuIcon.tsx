import * as React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {ViewStyleProp} from '../../sharedTypes';

export const DrawerMenuIcon = ({
  onPress,
  style,
  testID,
  accessibilityLabel,
}: {
  onPress: () => void;
  style?: ViewStyleProp;
  testID: string;
  accessibilityLabel: string;
}) => (
  <TouchableOpacity
    style={[{justifyContent: 'center'}, style]}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}>
    <IonIcon name="menu" size={32} testID={testID} />
  </TouchableOpacity>
);
