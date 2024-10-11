import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {FormattedDate, defineMessages, useIntl} from 'react-intl';
import {
  useGetOwnRole,
  useGetRemoteArchives,
} from '../../../../hooks/server/projects';
import {Loading} from '../../../../sharedComponents/Loading';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../../../../sharedTypes';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {LIGHT_GREY, MEDIUM_GREY} from '../../../../lib/styles';
import {ScrollView} from 'react-native-gesture-handler';
// import {TouchableOpacity} from 'react-native';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.navTitle',
    defaultMessage: 'Remote Archive',
  },
  remoteArchiveOn: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn',
    defaultMessage: 'Remote Archive is On',
  },
  syncWithInternet: {
    id: 'ProjectSettings.RemoteArchive.syncWithInternet',
    defaultMessage:
      'Your project data is syncing to the archive over the internet to the secure, encrypted server below. The server owner can view the data',
  },
  remove: {
    id: 'ProjectSettings.RemoteArchive.remove',
    defaultMessage: 'Remove the server to stop Remote Archive.',
  },
  coordinatorCanTurnOff: {
    id: 'ProjectSettings.RemoteArchive.coordinatorCanTurnOff',
    defaultMessage: 'Only a Project Coordinator can turn off Remote Archive.',
  },
  thisIncludes: {
    id: 'ProjectSettings.RemoteArchive.thisIncludes',
    defaultMessage: 'This includes ',
  },
  observations: {
    id: 'ProjectSettings.RemoteArchive.observations',
    defaultMessage: 'Observations (including photos and audio)',
  },
  tracks: {
    id: 'ProjectSettings.RemoteArchive.tracks',
    defaultMessage: 'Tracks',
  },
  deviceNames: {
    id: 'ProjectSettings.RemoteArchive.deviceNames',
    defaultMessage: 'Device Names',
  },
  projectSettings: {
    id: 'ProjectSettings.RemoteArchive.projectSettings',
    defaultMessage: 'Project Settings (categories, questions)',
  },
  serverName: {
    id: 'ProjectSettings.RemoteArchive.serverName',
    defaultMessage: 'Server Name',
  },
  dateAdded: {
    id: 'ProjectSettings.RemoteArchive.dateAdded',
    defaultMessage: 'Date Added',
  },
  //   remove: {
  //     id: 'ProjectSettings.RemoteArchive.remove',
  //     defaultMessage: 'Remove Server',
  //   },
});

export const RemoteArchiveOn: NativeNavigationComponent<
  'RemoteArchiveOn'
> = () => {
  const {formatMessage} = useIntl();
  const {data: role, isPending: roleIsPending} = useGetOwnRole();
  const {data: remoteArchive, isPending} = useGetRemoteArchives();

  const isCoordinator =
    role?.roleId === COORDINATOR_ROLE_ID || role?.roleId === CREATOR_ROLE_ID;

  const currentRemoteArchive = !remoteArchive ? undefined : remoteArchive[0];

  if (isPending || roleIsPending) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 60}}>
      <Text style={styles.title}>{formatMessage(m.remoteArchiveOn)}</Text>
      <Text style={{marginTop: 20}}>{formatMessage(m.syncWithInternet)}</Text>

      {isCoordinator ? (
        <>
          {/* <Text>{formatMessage(m.remove)}</Text> */}
          <Text style={{marginTop: 20, fontWeight: 'bold'}}>
            {formatMessage(m.thisIncludes)}
          </Text>
          <Text>{formatMessage(m.observations)}</Text>
          <Text>{formatMessage(m.tracks)}</Text>
          <Text>{formatMessage(m.deviceNames)}</Text>
          <Text>{formatMessage(m.projectSettings)}</Text>
        </>
      ) : (
        <Text>{formatMessage(m.coordinatorCanTurnOff)}</Text>
      )}

      {currentRemoteArchive && (
        <>
          <View style={styles.nameDate}>
            <Text style={styles.smallGrayText}>
              {formatMessage(m.serverName)}
            </Text>
            <Text style={styles.smallGrayText}>
              {formatMessage(m.dateAdded)}
            </Text>
          </View>
          <View style={styles.card}>
            <View style={{alignSelf: 'flex-start', maxWidth: '70%'}}>
              <Text style={{fontSize: 14}}>{currentRemoteArchive.name}</Text>
              {currentRemoteArchive.selfHostedServerDetails && (
                <Text style={{fontSize: 14}}>
                  {currentRemoteArchive.selfHostedServerDetails.baseUrl}
                </Text>
              )}
              {/* {isCoordinator && (
                <TouchableOpacity>
                  <Text style={{fontSize: 14, color: RED, marginTop: 10}}>
                    {formatMessage(m.remove)}
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
            <Text
              style={{
                flex: 1,
                alignSelf: 'flex-start',
                textAlign: 'right',
                justifyContent: 'center',
                fontSize: 14,
                color: MEDIUM_GREY,
              }}>
              <FormattedDate
                value={currentRemoteArchive.joinedAt}
                year="numeric"
                month="short"
                day="2-digit"
              />
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

RemoteArchiveOn.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
  },
  nameDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallGrayText: {
    fontSize: 12,
    color: MEDIUM_GREY,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
    justifyContent: 'space-between',
  },
});
