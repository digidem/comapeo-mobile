import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {View, StyleSheet, Linking} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {List, ListItem, ListItemText} from '../../sharedComponents/List';
import {MethodName, useDeviceInfo} from '../../hooks/useDeviceInfo';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {BLUE_GREY, VERY_LIGHT_GREY} from '../../lib/styles';
import {useEarlyAccessState} from '../../contexts/EarlyAccessContext';
import {BodyText} from '../../sharedComponents/Text/BodyText';

const m = defineMessages({
  aboutCoMapeoTitle: {
    id: '$1screens.AboutSettings.title',
    defaultMessage: 'About CoMapeo',
    description: "Title of 'About CoMapeo' screen",
  },
  coMapeoVersion: {
    id: 'screens.AboutSettings.CoMapeoVersion',
    defaultMessage: 'CoMapeo version',
    description: 'Label for CoMapeo version',
  },
  coMapeoBuild: {
    id: 'screens.AboutSettings.CoMapeoBuild',
    defaultMessage: 'CoMapeo build',
    description: 'Label for CoMapeo build number',
  },
  mapeoType: {
    id: 'screens.AboutSettings.CoMapeoType',
    defaultMessage: 'CoMapeo variant',
    description:
      'Label for CoMapeo type/variant (e.g. QA for testing vs normal version of app)',
  },
  androidVersion: {
    id: 'screens.AboutSettings.androidVersion',
    defaultMessage: 'Android version',
    description: 'Label for Android version',
  },
  androidBuild: {
    id: 'screens.AboutSettings.androidBuild',
    defaultMessage: 'Android build number',
    description: 'Label for Android build number',
  },
  phoneModel: {
    id: 'screens.AboutSettings.phoneModel',
    defaultMessage: 'Phone model',
    description: 'Label for phone model',
  },
  unknown: {
    id: 'screens.AboutSettings.unknownValue',
    defaultMessage: 'Unknown',
    description: 'Shown when a device info (e.g. version number) is unknown',
  },
  emojiSource: {
    id: 'screens.AboutSettings.emojiSource',
    defaultMessage: 'Emojis source',
    description: 'Label for the source of emojis used in CoMapeo',
  },
  releaseNameLabel: {
    id: 'screens.AboutSettings.releaseNameLabel',
    defaultMessage: 'Release name',
    description: 'Label for the release name',
  },
  seeUpdates: {
    id: '$1screens.AboutSettings.seeUpdates',
    defaultMessage: 'See CoMapeo Updates',
  },
  earlyAccessBanner: {
    id: 'screens.AboutSettings.earlyAccessBanner',
    defaultMessage: 'You are in Early Access Mode.',
  },
  comapeoWebsiteLabel: {
    id: 'screens.AboutSettings.comapeoWebsiteLabel',
    defaultMessage: 'CoMapeo Website',
  },
});

const DeviceInfoListItem = ({
  label,
  deviceInfoMethod,
}: {
  label: string;
  deviceInfoMethod: MethodName;
}) => {
  const {formatMessage} = useIntl();
  const {data, isPending, error} = useDeviceInfo(deviceInfoMethod);

  return (
    <ListItem disableGutters>
      <ListItemText
        primary={label}
        secondary={
          isPending ? (
            <LoadingIndicator />
          ) : error || typeof data !== 'string' ? (
            formatMessage(m.unknown)
          ) : (
            data
          )
        }
      />
    </ListItem>
  );
};

export const AboutSettings = () => {
  const {formatMessage: t} = useIntl();
  const isEarly = useEarlyAccessState(s => s.isEarlyAccessEnabled);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isEarly ? (
        <View style={styles.banner} testID="ABOUT.ea-banner">
          <MaterialIcon name="flag" size={20} />
          <BodyText>{t(m.earlyAccessBanner)}</BodyText>
        </View>
      ) : null}
      <List disablePadding>
        <DeviceInfoListItem
          label={t(m.coMapeoVersion)}
          deviceInfoMethod="getVersion"
        />
        <DeviceInfoListItem
          label={t(m.coMapeoBuild)}
          deviceInfoMethod="getBuildNumber"
        />
        <DeviceInfoListItem
          label={t(m.mapeoType)}
          deviceInfoMethod="getBundleId"
        />
        <DeviceInfoListItem
          label={t(m.androidVersion)}
          deviceInfoMethod="getSystemVersion"
        />
        <DeviceInfoListItem
          label={t(m.androidBuild)}
          deviceInfoMethod="getBuildId"
        />
        <DeviceInfoListItem
          label={t(m.phoneModel)}
          deviceInfoMethod="getModel"
        />
        <ListItem
          disableGutters
          onPress={() => Linking.openURL('https://openmoji.org/')}>
          <ListItemText
            primary={t(m.emojiSource)}
            secondary="https://openmoji.org/"
          />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary={t(m.releaseNameLabel)} secondary="Abare" />
        </ListItem>
        <ListItem
          disableGutters
          onPress={() => Linking.openURL('https://comapeo.app')}>
          <ListItemText
            primary={t(m.comapeoWebsiteLabel)}
            secondary="comapeo.app"
          />
        </ListItem>
      </List>
      <View style={styles.bottomButton}>
        <SecondaryButton
          fullSize
          text={t(m.seeUpdates)}
          onPress={() => Linking.openURL('https://comapeo.app')}
        />
      </View>
    </ScrollView>
  );
};

AboutSettings.navTitle = m.aboutCoMapeoTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    gap: 20,
  },
  banner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: VERY_LIGHT_GREY,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  bottomButton: {
    alignItems: 'center',
  },
});
