import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import {Button} from '../../../../sharedComponents/Button';
import {MEDIUM_GREY} from '../../../../lib/styles';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';
import {useGetOwnRole} from '../../../../hooks/server/projects';
import {UIActivityIndicator} from 'react-native-indicators';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../../../../sharedTypes';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.navTitle',
    defaultMessage: 'Remote Archive',
  },
  remoteArchiveOff: {
    id: 'ProjectSettings.RemoteArchive.Coordinator.remoteArchiveOff',
    defaultMessage: 'Remote Archive is Off',
  },
  dataNotShared: {
    id: 'ProjectSettings.RemoteArchive.Coordinator.dataNotShared',
    defaultMessage:
      'The data in your project is not shared over the internet. Only people in your project can see your data.',
  },
  experimentalFeature: {
    id: 'ProjectSettings.RemoteArchive.Coordinator.experimentalFeature',
    defaultMessage:
      'This is an experimental feature. You need a Remote Archive URL to enable Remote Archive.',
  },
  noServers: {
    id: 'ProjectSettings.RemoteArchive.Coordinator.noServers',
    defaultMessage: 'No servers have been added to this project',
  },
  addArchive: {
    id: 'ProjectSettings.RemoteArchive.Coordinator.addArchive',
    defaultMessage: '+ Add Remote Archive',
  },
});

export const RemoteArchiveOff: NativeNavigationComponent<
  'RemoteArchiveOff'
> = () => {
  const {formatMessage} = useIntl();
  const {navigate} = useNavigationFromRoot();
  const {data: role, isPending: roleIsPending} = useGetOwnRole();
  const isCoordinator =
    role?.roleId === COORDINATOR_ROLE_ID || role?.roleId === CREATOR_ROLE_ID;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatMessage(m.remoteArchiveOff)} </Text>
      <Text style={{marginTop: 20}}>{formatMessage(m.dataNotShared)}</Text>
      <Text style={{marginTop: 20}}>
        {formatMessage(m.experimentalFeature)}
      </Text>
      <Text style={styles.subtext}>{formatMessage(m.noServers)}</Text>
      {roleIsPending ? (
        <UIActivityIndicator />
      ) : isCoordinator ? (
        <Button
          variant="outlined"
          style={{marginTop: 20}}
          onPress={() => {
            navigate('AddRemoteArchive');
          }}>
          {formatMessage(m.addArchive)}
        </Button>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
  },
  subtext: {
    color: MEDIUM_GREY,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
});

RemoteArchiveOff.navTitle = m.navTitle;
