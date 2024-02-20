import * as React from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {useForm} from 'react-hook-form';

import {NativeNavigationComponent} from '../../../../sharedTypes';
import {
  useDeviceInfo,
  useEditDeviceInfo,
} from '../../../../hooks/server/deviceInfo';
import {BLACK} from '../../../../lib/styles';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {IconButton} from '../../../../sharedComponents/IconButton';
import {SaveIcon} from '../../../../sharedComponents/icons';
import {FieldRow} from './FieldRow';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.DeviceName.EditScreen.title',
    defaultMessage: 'Device Name',
  },
  deviceNameLabel: {
    id: 'screens.Setting.ProjectSettings.DeviceName.EditScreen.deviceNameLabel',
    defaultMessage: 'Edit Device Name',
  },
  discardChangesAlertTitle: {
    id: 'screens.Setting.ProjectSettings.DeviceName.EditScreen.discardChangesAlertTitle',
    defaultMessage: 'Discard changes?',
  },
  discardChangesAlertConfirmText: {
    id: 'screens.Setting.ProjectSettings.DeviceName.EditScreen.discardChangesAlertConfirmText',
    defaultMessage: 'Discard Changes',
  },
  discardChangesAlertCancelText: {
    id: 'screens.Setting.ProjectSettings.DeviceName.EditScreen.discardChangesAlertCancelText',
    defaultMessage: 'Continue Editing',
  },
});

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.title),
      animation: 'none',
      headerRight: () => (
        <IconButton onPress={() => {}}>
          <SaveIcon />
        </IconButton>
      ),
    };
  };
}

export const EditScreen: NativeNavigationComponent<'DeviceNameEdit'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();

  const {data} = useDeviceInfo();

  const deviceName = data?.name;

  const {control, getValues, handleSubmit} = useForm<{
    deviceName: string;
  }>({defaultValues: {deviceName}});

  const {mutate: updateDeviceName} = useEditDeviceInfo();

  React.useEffect(
    function showDiscardChangesAlert() {
      const unsubscribe = navigation.addListener('beforeRemove', event => {
        // Ignore cases where navigation after successful submission occurs
        if (event.data.action.type !== 'GO_BACK') return;

        const nameHasChanges = getValues('deviceName') !== deviceName;

        if (!nameHasChanges) return;

        event.preventDefault();

        Alert.alert(t(m.discardChangesAlertTitle), undefined, [
          {style: 'cancel', text: t(m.discardChangesAlertCancelText)},
          {
            style: 'default',
            text: t(m.discardChangesAlertConfirmText),
            onPress: () => {
              navigation.dispatch(event.data.action);
            },
          },
        ]);
      });

      return () => {
        unsubscribe();
      };
    },
    [t, navigation, getValues, deviceName],
  );

  React.useEffect(
    function updateNavigationOptions() {
      navigation.setOptions({
        headerRight: () => {
          return (
            <IconButton
              onPress={handleSubmit(value => {
                updateDeviceName(value.deviceName, {
                  onSuccess: () => navigation.navigate('DeviceNameDisplay'),
                  onError: _err => {
                    // TODO: Handle errors
                  },
                });
              })}>
              <SaveIcon />
            </IconButton>
          );
        },
      });
    },
    [handleSubmit, navigation, updateDeviceName],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FieldRow label={t(m.deviceNameLabel)}>
        <HookFormTextInput
          control={control}
          name="deviceName"
          rules={{maxLength: 60, required: true, minLength: 1}}
          // TODO: Update HookFormTextInput implementation so that either:
          // - the implementation fully determines the text input's base style and this component doesn't allow custom styling
          // - this style prop is properly merged with the text input's base style in the implementation
          style={{flex: 1, color: BLACK, fontSize: 16}}
          showCharacterCount
          autoFocus
        />
      </FieldRow>
    </ScrollView>
  );
};

EditScreen.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
});
