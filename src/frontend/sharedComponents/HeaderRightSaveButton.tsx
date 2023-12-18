import * as React from 'react';
import {useEditDeviceInfo} from '../hooks/server/deviceInfo';
import {IconButton} from './IconButton';
import {SaveIcon} from './icons';
useEditDeviceInfo;

export const HeaderRightSaveButton = ({
  onPress = () => {},
}: {
  onPress?: () => void;
}) => {
  return (
    <IconButton onPress={onPress}>
      <SaveIcon />
    </IconButton>
  );
};
