import {create} from 'zustand';

type DeviceNameStore = {
  isEditting: boolean;
  error: boolean;
  newName: string;
  actions: {
    setIsEditting: (shouldEdit: boolean) => void;
    setNewName: (newNameVal: string) => void;
    setError: (isError: boolean) => void;
  };
};

export const useDeviceNameStore = create<DeviceNameStore>()((set, get) => {
  return {
    isEditting: false,
    error: false,
    newName: '',
    actions: {
      setIsEditting: shouldEdit => set(state => ({isEditting: shouldEdit})),
      setNewName: newNameVal => {
        if (newNameVal.length > 60) {
          set(state => ({error: true}));
          return;
        }
        if (get().error) set(state => ({error: false}));

        set(state => ({newName: newNameVal}));
      },
      setError: isError => set(state => ({error: isError})),
    },
  };
});

export const useDeviceNameStoreActions = () => {
  return useDeviceNameStore(store => store.actions);
};
