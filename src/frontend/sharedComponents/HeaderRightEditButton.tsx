import * as React from 'react';
import {useEditDeviceInfo} from '../hooks/server/deviceInfo';
import {IconButton} from './IconButton';
import {EditIcon} from './icons';
useEditDeviceInfo;

export const HeaderRightEditButton = ({
  onPress = () => {},
}: {
  onPress?: () => void;
}) => {
  return (
    <IconButton onPress={onPress}>
      <EditIcon />
    </IconButton>
  );
};
