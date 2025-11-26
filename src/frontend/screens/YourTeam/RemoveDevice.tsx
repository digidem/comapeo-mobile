import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import * as Sentry from '@sentry/react-native';
import {useForm} from 'react-hook-form';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {BLUE_GREY} from '../../lib/styles';
import {DestructiveButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectSettings, useRemoveMember} from '@comapeo/core-react';
import Ionicons from '@react-native-vector-icons/ionicons';
import {HookFormTextInput} from '../../sharedComponents/HookFormTextInput';

const m = defineMessages({
  title: {
    id: 'screens.YourTeam.RemoveDevice.title',
    defaultMessage: 'Remove Device',
  },
  reasonLabel: {
    id: 'screens.YourTeam.RemoveDevice.reasonLabel',
    defaultMessage: 'Reason for removal?',
  },
  removeAndNotifyButton: {
    id: 'screens.YourTeam.RemoveDevice.removeAndNotifyButton',
    defaultMessage: 'Remove & Notify',
  },
});

export const RemoveDevice: NativeNavigationComponent<'RemoveDevice'> = ({
  navigation,
  route,
}) => {
  const {formatMessage: t} = useIntl();
  const {deviceId, deviceName} = route.params;
  const {projectId} = useActiveProject();
  const {data: projectSettings} = useProjectSettings({projectId});

  const {control, handleSubmit} = useForm<{
    reason?: string;
  }>({
    defaultValues: {
      reason: '',
    },
  });

  const removeMemberMutation = useRemoveMember({projectId});

  const handleRemoveDevice = handleSubmit(data => {
    const trimmedReason = data.reason?.trim();

    removeMemberMutation.mutate(
      {
        deviceId: deviceId,
        ...(trimmedReason && {reason: trimmedReason}),
      },
      {
        onSuccess: () => {
          if (projectSettings.name) {
            navigation.replace('DeviceRemovedSuccess', {
              deviceName,
              projectName: projectSettings.name,
            });
          }
        },
        onError: error => {
          Sentry.captureException(error);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  });

  return (
    <ScreenContentWithDock
      dockContent={
        <DestructiveButton
          fullSize
          text={t(m.removeAndNotifyButton)}
          onPress={handleRemoveDevice}
          renderIcon={({color, size}) => (
            <Ionicons size={size} color={color} name="person-remove-outline" />
          )}
        />
      }>
      <View style={styles.reasonSection}>
        <BodyText variant="smallMeta">{t(m.reasonLabel)}</BodyText>
        <HookFormTextInput
          control={control}
          rules={{maxLength: 100, required: false}}
          multiline={true}
          containerStyle={styles.inputContainer}
          showCharacterCount={true}
          name="reason"
        />
      </View>
    </ScreenContentWithDock>
  );
};

RemoveDevice.navTitle = m.title;

const styles = StyleSheet.create({
  reasonSection: {
    gap: 6,
  },
  inputContainer: {
    alignItems: 'flex-start',
    minHeight: 150,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 4,
  },
});
