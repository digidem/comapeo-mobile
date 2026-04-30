import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {useAuthContext} from '../../contexts/AuthContext';
import {useEarlyAccessState} from '../../contexts/EarlyAccessContext';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext';
import {useMetricsDiagnosticsEnabled} from '../../contexts/MetricsDiagnosticsStoreContext';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag';
import {USABLE_LANGUAGES} from '../../lib/intl';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useSecurityState} from '../../contexts/SecurityStoreContext';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {
  BLACK,
  BLUE_GREY,
  COMAPEO_BLUE,
  NEW_DARK_GREY,
  VERY_LIGHT_BLUE,
} from '../../lib/styles';
import HeartCheckIcon from '../../images/HeartCheck.svg';
import type {MaterialIconsIconName} from '@react-native-vector-icons/material-icons';

const m = defineMessages({
  title: {
    id: '$1Screens.Settings.AppSettings.title',
    defaultMessage: 'CoMapeo Settings',
  },
  thisDevice: {
    id: '$1Screens.Settings.AppSettings.thisDevice',
    defaultMessage: 'THIS DEVICE',
  },
  sharingPermissions: {
    id: '$1Screens.Settings.AppSettings.sharingPermissions',
    defaultMessage: 'SHARING PERMISSIONS',
  },
  edit: {
    id: '$1Screens.Settings.AppSettings.edit',
    defaultMessage: 'Edit',
  },
  coordinateUtm: {
    id: '$1Screens.Settings.AppSettings.coordinateUtm',
    defaultMessage: 'UTM Coordinates',
  },
  coordinateDd: {
    id: '$1Screens.Settings.AppSettings.coordinateDd',
    defaultMessage: 'Decimal Degrees',
  },
  coordinateDms: {
    id: '$1Screens.Settings.AppSettings.coordinateDms',
    defaultMessage: 'Degrees/Min/Sec',
  },
  noPasscode: {
    id: '$1Screens.Settings.AppSettings.noPasscode',
    defaultMessage: 'No Passcode',
  },
  passcode: {
    id: '$1Screens.Settings.AppSettings.passcode',
    defaultMessage: 'Passcode',
  },
  earlyAccessOn: {
    id: '$1Screens.Settings.AppSettings.earlyAccessOn',
    defaultMessage: 'Early Access ON',
  },
  earlyAccessOff: {
    id: '$1Screens.Settings.AppSettings.earlyAccessOff',
    defaultMessage: 'Early Access OFF',
  },
  turnOn: {
    id: '$1Screens.Settings.AppSettings.turnOn',
    defaultMessage: 'Turn On',
  },
  turnOff: {
    id: '$1Screens.Settings.AppSettings.turnOff',
    defaultMessage: 'Turn Off',
  },
  aboutCoMapeo: {
    id: '$1Screens.Settings.AppSettings.aboutCoMapeo',
    defaultMessage: 'About CoMapeo',
  },
  createTestData: {
    id: '$1Screens.Settings.AppSettings.createTestData',
    defaultMessage: 'Create Test Data',
  },
  diagnosticInformation: {
    id: '$1Screens.Settings.AppSettings.diagnosticInformation',
    defaultMessage: 'Diagnostic Information',
  },
});

export const AppSettings: NativeNavigationComponent<'AppSettings'> = ({
  navigation,
}) => {
  const {formatMessage} = useIntl();
  const {authState} = useAuthContext();
  const isEarlyAccess = useEarlyAccessState(s => s.isEarlyAccessEnabled);
  const coordinateFormat = useCoordinateFormat();
  const diagnosticsEnabled = useMetricsDiagnosticsEnabled();
  const appLocale = useAppLanguageTag();
  const passcode = useSecurityState(s => s.passcode);
  const {data: deviceInfo} = useOwnDeviceInfo();

  const currentLanguageName =
    USABLE_LANGUAGES.find(l => l.languageTag === appLocale)?.nativeName ??
    appLocale;

  const coordinateLabel = {
    utm: formatMessage(m.coordinateUtm),
    dd: formatMessage(m.coordinateDd),
    dms: formatMessage(m.coordinateDms),
  }[coordinateFormat];

  const hasPasscode = passcode !== null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionHeader label={formatMessage(m.thisDevice)} />

      <SettingsRow
        testID="device-name-list-item"
        onPress={() => navigation.navigate('DeviceNameDisplay')}
        label={deviceInfo.name ?? ''}
        actionText={formatMessage(m.edit)}
        materialIconName="phone-android"
      />

      <SettingsRow
        testID="languageSettingsButton"
        onPress={() => navigation.navigate('LanguageSettings')}
        label={currentLanguageName}
        showArrow
        materialIconName="language"
      />

      <SettingsRow
        testID="settingsCoodinatesButton"
        onPress={() => navigation.navigate('CoordinateFormat')}
        label={coordinateLabel}
        showArrow
        materialIconName="explore"
      />

      {authState !== 'obscured' && (
        <SettingsRow
          onPress={() => navigation.navigate('Security')}
          label={
            hasPasscode
              ? formatMessage(m.passcode)
              : formatMessage(m.noPasscode)
          }
          actionText={
            hasPasscode ? formatMessage(m.turnOff) : formatMessage(m.turnOn)
          }
          materialIconName="security"
        />
      )}

      <SettingsRow
        testID="earlyAccessFlag"
        onPress={() => navigation.navigate('EarlyAccess')}
        label={
          isEarlyAccess
            ? formatMessage(m.earlyAccessOn)
            : formatMessage(m.earlyAccessOff)
        }
        actionText={
          isEarlyAccess ? formatMessage(m.turnOff) : formatMessage(m.turnOn)
        }
        materialIconName="flag"
      />

      <SettingsRow
        testID="aboutSettingsButton"
        onPress={() => navigation.navigate('AboutSettings')}
        label={formatMessage(m.aboutCoMapeo)}
        showArrow
        materialIconName="info-outline"
      />

      {process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI && (
        <SettingsRow
          onPress={() => navigation.navigate('CreateTestData')}
          label={formatMessage(m.createTestData)}
          showArrow
          materialIconName="auto-fix-high"
        />
      )}

      <View style={styles.divider} />

      <SectionHeader label={formatMessage(m.sharingPermissions)} />

      <SettingsRow
        testID="dataAndPrivacyButton"
        onPress={() => navigation.navigate('DataAndPrivacy')}
        label={formatMessage(m.diagnosticInformation)}
        actionText={
          diagnosticsEnabled
            ? formatMessage(m.turnOff)
            : formatMessage(m.turnOn)
        }
        icon={<HeartCheckIcon width={24} height={24} />}
      />
    </ScrollView>
  );
};

AppSettings.navTitle = m.title;

function SectionHeader({label}: {label: string}) {
  return (
    <BodyText variant="tinyMeta" style={styles.sectionHeader}>
      {label}
    </BodyText>
  );
}

function SettingsRow({
  label,
  onPress,
  actionText,
  showArrow,
  testID,
  materialIconName,
  icon,
}: {
  label: string;
  onPress: () => void;
  actionText?: string;
  showArrow?: boolean;
  testID?: string;
  materialIconName?: MaterialIconsIconName;
  icon?: React.ReactNode;
}) {
  return (
    <TouchableNativeFeedback
      testID={testID}
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
      <View style={styles.row}>
        {materialIconName ? (
          <MaterialIcon
            name={materialIconName}
            size={24}
            color={NEW_DARK_GREY}
          />
        ) : icon ? (
          icon
        ) : null}
        <HeaderText variant="header6" style={styles.rowLabel}>
          {label}
        </HeaderText>
        {actionText ? (
          <BodyText variant="tinyMeta" style={styles.actionText}>
            {actionText}
          </BodyText>
        ) : showArrow ? (
          <MaterialIcon name="chevron-right" size={20} color={NEW_DARK_GREY} />
        ) : null}
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 12,
  },
  sectionHeader: {
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: BLACK,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
    minHeight: 54,
  },
  rowLabel: {
    flex: 1,
  },
  actionText: {
    color: COMAPEO_BLUE,
  },
  divider: {
    height: 1,
    backgroundColor: BLUE_GREY,
    marginVertical: 10,
  },
});
