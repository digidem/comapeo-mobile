import * as React from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {useForm} from 'react-hook-form';
import {UIActivityIndicator} from 'react-native-indicators';

import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {
  useDeviceInfo,
  useEditDeviceInfo,
} from '../../../../hooks/server/deviceInfo';
import {BLACK} from '../../../../lib/styles';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {IconButton} from '../../../../sharedComponents/IconButton';
import SaveIcon from '../../../../images/CheckMark.svg';
import {ErrorBottomSheet} from '../../../../sharedComponents/ErrorBottomSheet';
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
        <IconButton testID="save-icon" onPress={() => {}}>
          <SaveIcon />
        </IconButton>
      ),
    };
  };
}

export const EditScreen = ({
  navigation,
}: NativeRootNavigationProps<'DeviceNameEdit'>) => {
  const {formatMessage: t} = useIntl();

  const {data} = useDeviceInfo();

  const deviceName = data?.name;

  const {control, getValues, handleSubmit, formState} = useForm<{
    deviceName: string;
  }>({defaultValues: {deviceName}});

  const {isPending, mutate, error, reset} = useEditDeviceInfo();

  const {isDirty: nameHasChanges} = control.getFieldState(
    'deviceName',
    formState,
  );

  React.useEffect(
    function showDiscardChangesAlert() {
      const unsubscribe = navigation.addListener('beforeRemove', event => {
        // Ignore cases where navigation after successful submission occurs
        if (event.data.action.type !== 'GO_BACK') return;

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
    [t, navigation, getValues, nameHasChanges],
  );

  const onPress = React.useCallback(() => {
    if (isPending) return;

    handleSubmit(async value => {
      if (!nameHasChanges) {
        navigation.navigate('DeviceNameDisplay');
        return;
      }

      mutate(value.deviceName, {
        onSuccess: () => navigation.navigate('DeviceNameDisplay'),
      });
    });
  }, [handleSubmit, isPending, mutate, nameHasChanges, navigation]);

  React.useEffect(
    function updateNavigationOptions() {
      navigation.setOptions({
        headerRight: () => {
          return (
            <IconButton testID="save-icon" onPress={onPress}>
              {isPending ? <UIActivityIndicator size={30} /> : <SaveIcon />}
            </IconButton>
          );
        },
      });
    },
    [handleSubmit, navigation, isPending, mutate, nameHasChanges, onPress],
  );

  console.log('is pending ', isPending);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <FieldRow label={t(m.deviceNameLabel)}>
          <HookFormTextInput
            testID="MAIN.edit-device-name"
            control={control}
            name="deviceName"
            rules={{maxLength: 60, required: true, minLength: 1}}
            // TODO: Update HookFormTextInput implementation so that either:
            // - the implementation fully determines the text input's base style and this component doesn't allow custom styling
            // - this style prop is properly merged with the text input's base style in the implementation
            style={{flex: 1, color: BLACK, fontSize: 16}}
            showCharacterCount
            autoFocus
            editable={isPending}
          />
        </FieldRow>
      </ScrollView>
      <ErrorBottomSheet error={error} clearError={reset} tryAgain={onPress} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
});
