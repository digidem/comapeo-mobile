import * as React from 'react';
import {useEditDeviceInfo} from '../../../hooks/server/deviceInfo';
import {
  useDeviceNameStore,
  useDeviceNameStoreActions,
} from '../../../hooks/store/useDeviceNameStore';
import {IconButton} from '../../../sharedComponents/IconButton';
import {EditIcon, SaveIcon} from '../../../sharedComponents/icons';
useEditDeviceInfo;

export const HeaderRightDeviceName = () => {
  const isEditting = useDeviceNameStore(store => store.isEditting);
  const newName = useDeviceNameStore(store => store.newName);
  const {setIsEditting, setError, setNewName} = useDeviceNameStoreActions();
  const {mutate} = useEditDeviceInfo();

  const validateAndMutateName = React.useCallback(() => {
    const newNameTrimmed = newName.trim();
    const nameLength = newNameTrimmed.length;
    if (nameLength < 1 || nameLength > 60) {
      setError(true);
      return;
    }

    mutate(newName);
    setIsEditting(false);
    setNewName('');
  }, [newName]);
  return (
    <IconButton
      onPress={() =>
        !isEditting ? setIsEditting(true) : validateAndMutateName()
      }>
      {!isEditting ? <EditIcon /> : <SaveIcon />}
    </IconButton>
  );
};
