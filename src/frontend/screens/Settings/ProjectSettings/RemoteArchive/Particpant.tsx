import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import {LIGHT_GREY, MEDIUM_GREY} from '../../../../lib/styles';
import {ViewStyleProp} from '../../../../sharedTypes';

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
  serverName: {
    id: 'ProjectSettings.RemoteArchive.Particpants.serverName',
    defaultMessage: 'Server Name',
  },
  dateAdded: {
    id: 'ProjectSettings.RemoteArchive.Particpants.dateAdded',
    defaultMessage: 'Date Added',
  },
});

export const Particpant = () => {
  const [remoteArchiveOn] = React.useState(false);

  return true ? <ArchiveOn /> : <ArchiveOff />;
};

const ArchiveOff = () => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatMessage(m.archiveOff)}</Text>
      <Text style={styles.mainText}>{formatMessage(m.dataNotShared)}</Text>
      <Text style={styles.mainText}>
        {formatMessage(m.experimentalFeature)}
      </Text>
      <Text style={styles.subText}>{formatMessage(m.noServers)}</Text>
    </View>
  );
};

const ArchiveOn = () => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatMessage(m.archiveOn)}</Text>
      <Text style={styles.mainText}>{formatMessage(m.dataSyncing)}</Text>
      <Text style={styles.mainText}>
        {formatMessage(m.coordinatorCanTurnOff)}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <Text style={styles.greyText}>{formatMessage(m.serverName)}</Text>
        <Text style={styles.greyText}>{formatMessage(m.dateAdded)}</Text>
      </View>
      <ActiveRemoteArchiveCard
        name="Tom's Server"
        url="www.calgaryplanet.org"
        date="Aug 25, 2024"
      />
    </View>
  );
};

type ActiveRemoteArchiveCardProps = {
  name: string;
  date: string;
  url: string;
  style?: ViewStyleProp;
};

const ActiveRemoteArchiveCard = ({
  name,
  date,
  url,
  style,
}: ActiveRemoteArchiveCardProps) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <View>
        <Text>{name}</Text>
        <Text style={{color: MEDIUM_GREY}}>{url}</Text>
      </View>
      <Text>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    textAlign: 'center',
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  mainText: {
    marginTop: 20,
  },
  subText: {
    textAlign: 'center',
    marginTop: 20,
    color: MEDIUM_GREY,
  },
  cardContainer: {
    borderColor: LIGHT_GREY,
    flexDirection: 'row',
    borderWidth: 1,
    padding: 20,
    shadowColor: MEDIUM_GREY,
    shadowRadius: 20,
  },
  greyText: {
    color: MEDIUM_GREY,
  },
});
