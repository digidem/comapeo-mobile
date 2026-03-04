import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';

import {MEDIUM_GREY} from '../../lib/styles';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

const m = defineMessages({
  // primary-string
  remoteArchiveOff: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOff.remoteArchiveOff',
    defaultMessage: 'Remote Archive is Off',
  },
  dataNotShared: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOff.dataNotShared',
    defaultMessage:
      'The data in your project is not shared over the internet. Only people in your project can see your data.',
  },
  experimentalFeature: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOff.experimentalFeature',
    defaultMessage:
      'This is an experimental feature. You need a Remote Archive URL to enable Remote Archive.',
  },
  noServers: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOff.noServers',
    defaultMessage: 'No servers have been added to this project',
  },
  // primary-string
  addArchive: {
    id: 'ProjectSettings.RemoteArchive.RemoteArchiveOff.addArchive',
    defaultMessage: 'Add Remote Archive',
  },
});

export function RemoteArchiveOff({
  isCoordinator,
  onAdd,
}: {
  isCoordinator: boolean;
  onAdd: () => void;
}) {
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderText variant="header2" style={styles.title}>
        {t(m.remoteArchiveOff)}
      </HeaderText>
      <View style={{gap: 20}}>
        <BodyText>{t(m.dataNotShared)}</BodyText>
        <BodyText>{t(m.experimentalFeature)}</BodyText>
      </View>

      <View style={{gap: 20}}>
        <BodyText variant="smallMeta" style={styles.subtext}>
          {t(m.noServers)}
        </BodyText>
        {isCoordinator && (
          <SecondaryButton
            fullSize
            renderIcon={({color, size}) => (
              <MaterialIcons size={size} name="plus" color={color} />
            )}
            text={t(m.addArchive)}
            onPress={() => {
              onAdd();
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingVertical: 40,
    gap: 40,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtext: {
    color: MEDIUM_GREY,
    textAlign: 'center',
  },
});
