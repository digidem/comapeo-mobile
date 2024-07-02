import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {defineMessages, useIntl} from 'react-intl';

import {List, ListItem, ListItemText} from '../../sharedComponents/List';
import {MethodName, useDeviceInfo} from '../../hooks/useDeviceInfo';
import {UIActivityIndicator} from 'react-native-indicators';

const m = defineMessages({
  aboutCoMapeoTitle: {
    id: 'screens.AboutSettings.title',
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
    <ListItem>
      <ListItemText
        primary={label}
        secondary={
          isPending ? (
            <UIActivityIndicator />
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

  return (
    <ScrollView>
      <List>
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
      </List>
    </ScrollView>
  );
};

AboutSettings.navTitle = m.aboutCoMapeoTitle;
