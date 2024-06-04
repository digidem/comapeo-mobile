import * as React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {IconButton} from '../IconButton';

export const DrawerMenuIcon = ({onPress}: {onPress: () => void}) => (
  <IconButton style={{alignSelf: 'flex-end'}} onPress={onPress}>
    <IonIcon name="menu" size={32} />
  </IconButton>
);
