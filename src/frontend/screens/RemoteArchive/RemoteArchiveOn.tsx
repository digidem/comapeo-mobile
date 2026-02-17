import * as React from 'react';
import {FormattedDate, defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {LIGHT_GREY, MAGENTA, MEDIUM_GREY} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.navTitle',
    defaultMessage: 'Remote Archive',
  },
  remoteArchiveOn: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.remoteArchiveOn',
    defaultMessage: 'Remote Archive is On',
  },
  syncWithInternet: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.syncWithInternet',
    defaultMessage:
      'Your project data is syncing to the archive over the internet to the secure, encrypted server below. The server owner can view the data.',
  },
  remove: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.remove',
    defaultMessage: 'Remove the server to stop Remote Archive.',
  },
  coordinatorCanTurnOff: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.coordinatorCanTurnOff',
    defaultMessage: 'Only a Project Coordinator can turn off Remote Archive.',
  },
  thisIncludes: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.thisIncludes',
    defaultMessage: 'This includes:',
  },
  observations: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.observations',
    defaultMessage: 'Observations (including photos and audio)',
  },
  tracks: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.tracks',
    defaultMessage: 'Tracks',
  },
  deviceNames: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.deviceNames',
    defaultMessage: 'Device Names',
  },
  projectSettings: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.projectSettings',
    defaultMessage: 'Project Settings (categories, questions)',
  },
  serverName: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.serverName',
    defaultMessage: 'Server Name',
  },
  dateAdded: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.dateAdded',
    defaultMessage: 'Date Added',
  },
  removeServer: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOn.removeServer',
    defaultMessage: 'Remove Server',
  },
});

export function RemoteArchiveOn({
  archiveBaseUrl,
  archiveDateAdded,
  archiveName,
  isCoordinator,
  onRemove,
}: {
  archiveBaseUrl: string;
  archiveDateAdded?: string;
  archiveName?: string;
  isCoordinator: boolean;
  onRemove: () => void;
}) {
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderText variant="header2" style={styles.title}>
        {t(m.remoteArchiveOn)}
      </HeaderText>

      <View>
        <BodyText>{t(m.syncWithInternet)}</BodyText>
        {isCoordinator && <BodyText>{t(m.remove)}</BodyText>}
      </View>

      {isCoordinator ? (
        <View>
          <BodyText variant="smallMeta" style={{fontWeight: 'bold'}}>
            {t(m.thisIncludes)}
          </BodyText>
          <BodyText variant="smallMeta">{t(m.observations)}</BodyText>
          <BodyText variant="smallMeta">{t(m.tracks)}</BodyText>
          <BodyText variant="smallMeta">{t(m.deviceNames)}</BodyText>
          <BodyText variant="smallMeta">{t(m.projectSettings)}</BodyText>
        </View>
      ) : (
        <BodyText>{t(m.coordinatorCanTurnOff)}</BodyText>
      )}

      <View style={{gap: 12}}>
        <View style={styles.nameDate}>
          <BodyText variant="smallMeta" style={{color: MEDIUM_GREY}}>
            {t(m.serverName)}
          </BodyText>
          <BodyText variant="smallMeta" style={{color: MEDIUM_GREY}}>
            {t(m.dateAdded)}
          </BodyText>
        </View>

        <View style={styles.card}>
          <View style={{alignSelf: 'flex-start', maxWidth: '70%', gap: 20}}>
            <View style={{gap: 4}}>
              <HeaderText variant="header6">{archiveName}</HeaderText>
              <BodyText
                testID="RA.archive-name"
                variant="smallMeta"
                style={{color: MEDIUM_GREY}}>
                {archiveBaseUrl}
              </BodyText>
            </View>
            {isCoordinator && (
              <TouchableOpacity
                onPress={() => {
                  onRemove();
                }}>
                <BodyText
                  style={{color: MAGENTA, fontWeight: 'bold'}}
                  variant="smallMeta">
                  {t(m.removeServer)}
                </BodyText>
              </TouchableOpacity>
            )}
          </View>

          <BodyText
            variant="tinyMeta"
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              textAlign: 'right',
              justifyContent: 'center',
              color: MEDIUM_GREY,
            }}>
            <FormattedDate
              value={archiveDateAdded}
              year="numeric"
              month="short"
              day="2-digit"
            />
          </BodyText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingVertical: 40,
    gap: 20,
  },
  title: {
    textAlign: 'center',
  },
  nameDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
