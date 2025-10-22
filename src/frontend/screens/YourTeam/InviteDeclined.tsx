import * as React from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text';
import {DeviceNameWithIcon} from '../../sharedComponents/DeviceNameWithIcon';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {resetToYourTeam} from '../../lib/resetToYourTeam';
import {PrimaryButton} from '../../sharedComponents/Buttons';

const m = defineMessages({
  inviteDeclined: {
    id: 'screens.Settings.YourTeam.InviteDeclined',
    defaultMessage: 'Invitation Declined',
  },
  inviteDeclinedDes: {
    id: 'screens.Settings.YourTeam.inviteDeclinedDes',
    defaultMessage:
      'This device has declined your invitation. They have not joined the project.',
  },
  close: {
    id: 'screens.Settings.YourTeam.close',
    defaultMessage: 'Close',
  },
});

export const InviteDeclined = ({
  navigation,
  route,
}: NativeRootNavigationProps<'InviteDeclined'>) => {
  const {formatMessage} = useIntl();
  const {name, deviceType, deviceId} = route.params;

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <ErrorIcon />
        <Text style={{marginTop: 20, fontSize: 20, fontWeight: 'bold'}}>
          {formatMessage(m.inviteDeclined)}
        </Text>
        <Text style={{marginTop: 10, textAlign: 'center'}}>
          {formatMessage(m.inviteDeclinedDes)}
        </Text>
        <DeviceNameWithIcon
          name={name}
          deviceType={deviceType}
          deviceId={deviceId}
          style={{marginTop: 20}}
        />
      </View>
      <PrimaryButton
        style={{marginTop: 10}}
        fullSize
        text={formatMessage(m.close)}
        onPress={() => resetToYourTeam(navigation.dispatch)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
});
