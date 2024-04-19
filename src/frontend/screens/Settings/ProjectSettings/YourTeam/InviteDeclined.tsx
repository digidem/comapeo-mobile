import * as React from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {Button} from '../../../../sharedComponents/Button';
import ErrorIcon from '../../../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../../sharedComponents/Text';
import {DeviceNameWithIcon} from '../../../../sharedComponents/DeviceNameWithIcon';
import {NativeRootNavigationProps} from '../../../../sharedTypes';
import {useFocusEffect} from '@react-navigation/native';

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
  const {role, ...deviceInfo} = route.params;

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
        <Text style={{marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>
          {formatMessage(m.inviteDeclined)}
        </Text>
        <Text style={{marginTop: 10, textAlign: 'center'}}>
          {formatMessage(m.inviteDeclinedDes)}
        </Text>
        <DeviceNameWithIcon {...deviceInfo} style={{marginTop: 10}} />
      </View>
      <Button
        style={{marginTop: 10}}
        fullWidth
        onPress={() => {
          navigation.navigate('YourTeam');
        }}>
        {formatMessage(m.close)}
      </Button>
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
