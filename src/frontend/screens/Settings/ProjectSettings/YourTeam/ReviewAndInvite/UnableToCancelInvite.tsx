import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../../../../sharedComponents/Button';
import ErrorIcon from '../../../../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../../../sharedComponents/Text';
import {DeviceNameWithIcon} from '../../../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../../../sharedComponents/RoleWithIcon';
import {
  COORDINATOR_ROLE_ID,
  NativeRootNavigationProps,
} from '../../../../../sharedTypes';
import {useProjectSettings} from '../../../../../hooks/server/projects';

const m = defineMessages({
  unableToCancel: {
    id: 'screens.Settings.YourTeam.unableToCancel',
    defaultMessage: 'Unable to Cancel Invitation',
  },
  deviceHasJoined: {
    id: 'screens.Settings.YourTeam.deviceHasJoined',
    defaultMessage: 'Device Has Joined {projectName}',
  },
  close: {
    id: 'screens.Settings.YourTeam.close',
    defaultMessage: 'Close',
  },
});

export const UnableToCancelInvite = ({
  navigation,
  route,
}: NativeRootNavigationProps<'UnableToCancelInvite'>) => {
  const {formatMessage} = useIntl();
  const {role, ...deviceInfo} = route.params;
  const {data} = useProjectSettings();

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <ErrorIcon />
        <Text style={{marginTop: 20, fontSize: 20, fontWeight: 'bold'}}>
          {formatMessage(m.unableToCancel)}
        </Text>
        {data?.name && (
          <Text style={{marginTop: 10}}>
            {formatMessage(m.deviceHasJoined, {projectName: data.name})}
          </Text>
        )}
        <DeviceNameWithIcon {...deviceInfo} style={{marginTop: 10}} />
        <RoleWithIcon
          style={{marginTop: 20}}
          role={role === COORDINATOR_ROLE_ID ? 'coordinator' : 'participant'}
        />
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
