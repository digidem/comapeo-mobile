import * as React from 'react';
import {View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  archiveOff: {
    id: 'ProjectSettings.RemoteArchive.Particpants.archiveOff',
    defaultMessage: 'Remote Archive is Off',
  },
  dataNotShared: {
    id: 'ProjectSettings.RemoteArchive.Particpants.dataNotShared',
    defaultMessage:
      'The data in your project is not shared over the internet. Only people in your project can see your data.',
  },
  experimentalFeature: {
    id: 'ProjectSettings.RemoteArchive.Particpants.experimentalFeature',
    defaultMessage:
      'This is an experimental feature. You need a Remote Archive URL to enable Remote Archive.',
  },
  noServers: {
    id: 'ProjectSettings.RemoteArchive.Particpants.noServers',
    defaultMessage: 'No servers have been added to this project',
  },
  archiveOn: {
    id: 'ProjectSettings.RemoteArchive.Particpants.archiveOn',
    defaultMessage: 'Remote Archive is On',
  },
  dataSyncing: {
    id: 'ProjectSettings.RemoteArchive.Particpants.dataSyncing',
    defaultMessage:
      'Your project data is syncing to the Remote Archive over the internet to the secure, encrypted server below. The server owner can view the data.',
  },
  coordinatorCanTurnOff: {
    id: 'ProjectSettings.RemoteArchive.Particpants.coordinatorCanTurnOff',
    defaultMessage: 'Only the Project Coordinator can turn off Remote Archive.',
  },
});

export const Particpant = () => {
  const [remoteArchiveOn] = React.useState(false);

  return remoteArchiveOn ? <ArchiveOn /> : <ArchiveOff />;
};

const ArchiveOff = () => {
  const {formatMessage} = useIntl();
  return (
    <View>
      <Text>{formatMessage(m.archiveOff)}</Text>
      <Text>{formatMessage(m.dataNotShared)}</Text>
      <Text>{formatMessage(m.experimentalFeature)}</Text>
      <Text>{formatMessage(m.noServers)}</Text>
    </View>
  );
};

const ArchiveOn = () => {
  const {formatMessage} = useIntl();
  return (
    <View>
      <Text>{formatMessage(m.archiveOn)}</Text>
      <Text>{formatMessage(m.dataSyncing)}</Text>
      <Text>{formatMessage(m.coordinatorCanTurnOff)}</Text>
    </View>
  );
};
