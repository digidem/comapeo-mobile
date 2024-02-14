import * as React from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {useForm} from 'react-hook-form';

import {
  NativeNavigationComponent,
  NativeRootNavigationProps,
} from '../../../../sharedTypes';
import {
  useDeviceInfo,
  useEditDeviceInfo,
} from '../../../../hooks/server/deviceInfo';
import {Text} from '../../../../sharedComponents/Text';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {IconButton} from '../../../../sharedComponents/IconButton';
import {EditIcon, SaveIcon} from '../../../../sharedComponents/icons';
import {FieldRow} from './FieldRow';
import {BLACK} from '../../../../lib/styles';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.DeviceName.title',
    defaultMessage: 'Device Name',
  },
  deviceNameDisplayHeader: {
    id: 'screens.Setting.ProjectSettings.DeviceName.deviceNameDisplayHeader',
    defaultMessage: 'Your Device Name',
  },
  deviceNameEditHeader: {
    id: 'screens.Setting.ProjectSettings.DeviceName.deviceNameEditHeader',
    defaultMessage: 'Edit Device Name',
  },
  discardChangesAlertTitle: {
    id: 'screens.Setting.ProjectSettings.DeviceName.discardChangesAlertTitle',
    defaultMessage: 'Discard changes?',
  },
  discardChangesAlertConfirmText: {
    id: 'screens.Setting.ProjectSettings.DeviceName.discardChangesAlertConfirmText',
    defaultMessage: 'Discard Changes',
  },
  discardChangesAlertCancelText: {
    id: 'screens.Setting.ProjectSettings.DeviceName.discardChangesAlertCancelText',
    defaultMessage: 'Continue Editing',
  },
});

export type NavigationParams = {mode: 'display' | 'edit'};

export const DeviceName: NativeNavigationComponent<'DeviceName'> = ({
  route,
  navigation,
}) => {
  const {mode} = route.params;
  const {data} = useDeviceInfo();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data?.name &&
        (mode === 'display' ? (
          <DisplayMode deviceName={data.name} navigation={navigation} />
        ) : (
          <EditMode deviceName={data.name} navigation={navigation} />
        ))}
    </ScrollView>
  );
};

function DisplayMode({
  deviceName,
  navigation,
}: {
  deviceName: string;
  navigation: React.ComponentProps<
    NativeNavigationComponent<'DeviceName'>
  >['navigation'];
}) {
  const {formatMessage: t} = useIntl();

  React.useEffect(
    function updateNavigationOptions() {
      navigation.setOptions({
        headerRight: () => (
          <IconButton onPress={() => navigation.setParams({mode: 'edit'})}>
            <EditIcon />
          </IconButton>
        ),
      });
    },
    [navigation],
  );

  return (
    <FieldRow label={t(m.deviceNameDisplayHeader)}>
      <Text>{deviceName}</Text>
    </FieldRow>
  );
}

DeviceName.navTitle = m.title;

function EditMode({
  deviceName,
  navigation,
}: {
  deviceName: string;
  navigation: React.ComponentProps<
    NativeNavigationComponent<'DeviceName'>
  >['navigation'];
}) {
  const {formatMessage: t} = useIntl();
  const {mutate: updateDeviceName} = useEditDeviceInfo();

  const {control, handleSubmit, watch} = useForm<{
    deviceName: string;
  }>({
    defaultValues: {deviceName},
  });

  const newDeviceName = watch('deviceName');
  const nameHasChanges = deviceName !== newDeviceName;

  React.useEffect(
    function showDiscardChangesAlert() {
      const unsubscribe = navigation.addListener('beforeRemove', event => {
        event.preventDefault();

        if (nameHasChanges) {
          Alert.alert(t(m.discardChangesAlertTitle), undefined, [
            {style: 'cancel', text: t(m.discardChangesAlertCancelText)},
            {
              style: 'default',
              text: t(m.discardChangesAlertConfirmText),
              onPress: () => {
                // navigation.dispatch(event.data.action);
                // TODO: Is going to display mode desired behavior here? Or should it go back to previous screen
                navigation.setParams({mode: 'display'});
              },
            },
          ]);
        } else {
          // TODO: Is going to display mode desired behavior here? Or should it go back to previous screen
          navigation.setParams({mode: 'display'});
        }
      });

      return () => {
        unsubscribe();
      };
    },
    [t, navigation, nameHasChanges],
  );

  React.useEffect(
    function updateNavigationOptions() {
      navigation.setOptions({
        headerRight: () => {
          return (
            <IconButton
              onPress={() => {
                console.log('onPress');
                handleSubmit(
                  value => {
                    console.log('onValid', value);
                    updateDeviceName(value.deviceName, {
                      onSuccess: () => navigation.setParams({mode: 'display'}),
                      onError: err => {
                        console.log('ERR', err);
                      },
                    });
                  },
                  errors => {
                    console.log('onInvalid', errors);
                  },
                );
              }}>
              <SaveIcon />
            </IconButton>
          );
        },
      });
    },
    [handleSubmit, navigation, updateDeviceName],
  );

  return (
    <FieldRow label={t(m.deviceNameEditHeader)}>
      <HookFormTextInput
        control={control}
        name="deviceName"
        rules={{maxLength: 100, required: true, minLength: 1}}
        // TODO: Update HookFormTextInput implementation so that either:
        // - the implementation fully determines the text input's base style and this component doesn't allow custom styling
        // - this style prop is properly merged with the text input's base style in the implementation
        style={{flex: 1, color: BLACK, fontSize: 16}}
        showCharacterCount
      />
    </FieldRow>
  );
}

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return ({
    navigation,
    route,
  }: NativeRootNavigationProps<'DeviceName'>): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.title),
      headerRight: () =>
        route.params.mode === 'display' ? (
          <IconButton onPress={() => navigation.setParams({mode: 'edit'})}>
            <EditIcon />
          </IconButton>
        ) : (
          <IconButton onPress={() => {}}>
            <SaveIcon />
          </IconButton>
        ),
    };
  };
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
});
