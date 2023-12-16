import * as React from 'react';
import {Alert, Keyboard, StyleSheet, TextInput} from 'react-native';
import {NativeNavigationComponent} from '../../../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {IconButton} from '../../../sharedComponents/IconButton';
import {EditIcon, SaveIcon} from '../../../sharedComponents/icons';
import {Text} from '../../../sharedComponents/Text';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {BLACK, MEDIUM_GREY, RED} from '../../../lib/styles';
import {
  useDeviceInfo,
  useEditDeviceInfo,
  useOptimisticDeviceName,
} from '../../../hooks/server/deviceInfo';
import {Loading} from '../../../sharedComponents/Loading';
import {
  useDeviceNameStore,
  useDeviceNameStoreActions,
} from '../../../hooks/store/useDeviceNameStore';
import {useMutationState} from '@tanstack/react-query';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.title',
    defaultMessage: 'Device Name',
  },
  yourDevice: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.yourDevice',
    defaultMessage: 'Your Device Name',
  },
  editDevice: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.editDevice',
    defaultMessage: 'Edit Device Name',
  },
  discardChanges: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.discardChanges',
    defaultMessage: 'Discard Changes',
  },
  continueEditting: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.continueEditting',
    defaultMessage: 'Continue Editting',
  },
});

export const DeviceName: NativeNavigationComponent<'DeviceName'> = ({
  navigation,
}) => {
  const isEditting = useDeviceNameStore(store => store.isEditting);
  const error = useDeviceNameStore(store => store.error);
  const newName = useDeviceNameStore(store => store.newName);
  const {setNewName} = useDeviceNameStoreActions();
  const updatedName = useOptimisticDeviceName();
  const deviceInfo = useDeviceInfo();
  const {formatMessage: t} = useIntl();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!isEditting) {
        // if user is not doing anything then don't intercept back action
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Prompt the user before leaving the screen
      Alert.alert(t(m.discardChanges), undefined, [
        {text: t(m.continueEditting), style: 'cancel', onPress: () => {}},
        {
          text: t(m.discardChanges),
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });

    return () => unsubscribe();
  }, [navigation, isEditting]);

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => Keyboard.dismiss()}>
      <Text style={{fontWeight: 'bold', marginBottom: 10}}>
        {t(!isEditting ? m.yourDevice : m.editDevice)}
      </Text>
      {!isEditting ? (
        deviceInfo.isLoading ? (
          <Loading />
        ) : (
          <Text>{updatedName ? updatedName : deviceInfo.data?.name}</Text>
        )
      ) : (
        <React.Fragment>
          <TextInput
            style={{
              borderColor: error ? RED : MEDIUM_GREY,
              borderWidth: 1,
              borderRadius: 5,
              color: BLACK,
              paddingStart: 10,
            }}
            value={newName || undefined}
            onChangeText={setNewName}
            placeholderTextColor={MEDIUM_GREY}
            // placeholder={deviceInfo.data?.name || undefined}
          />
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: 10,
              color: error ? RED : MEDIUM_GREY,
            }}>
            {`${newName ? newName.length : 0}/60`}
          </Text>
        </React.Fragment>
      )}
    </TouchableWithoutFeedback>
  );
};

DeviceName.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
});
