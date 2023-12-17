import * as React from 'react';
import {useEditDeviceInfo} from '../../../hooks/server/deviceInfo';
import {IconButton} from '../../../sharedComponents/IconButton';
import {EditIcon, SaveIcon} from '../../../sharedComponents/icons';
useEditDeviceInfo;

export const HeaderRightDeviceName = ({
  isEditting,
  setIsEditting,
  handleSubmit,
}: {
  isEditting: boolean;
  setIsEditting: (val: boolean) => void;
  handleSubmit: () => void;
}) => {
  const renderCounter = React.useRef(0);
  renderCounter.current = renderCounter.current + 1;
  console.log('from header', renderCounter.current);

  return (
    <IconButton
      onPress={() => (!isEditting ? setIsEditting(true) : handleSubmit())}>
      {!isEditting ? <EditIcon /> : <SaveIcon />}
    </IconButton>
  );
};
