import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {useAuthContext} from '../../contexts/AuthContext';
import {useEarlyAccessState} from '../../contexts/EarlyAccessContext';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext';
import {useLocaleState} from '../../contexts/LocaleStoreContext';
import {USABLE_LANGUAGES} from '../../lib/intl';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useSecurityState} from '../../contexts/SecurityStoreContext';
import {useUnitSystem} from '../../contexts/UnitSystemStoreContext';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BLACK, BLUE_GREY, COMAPEO_BLUE, NEW_DARK_GREY} from '../../lib/styles';
import HeartCheckIcon from '../../images/HeartCheck.svg';
import AngleRulerIcon from '../../images/AngleRuler.svg';
import {isQABuild} from '../../lib/appVariant';
import {useQADeviceName} from '../../contexts/QADeviceNameStoreContext';

const m = defineMessages({
  title: {
    id: '$1Screens.Settings.AppSettings.title',
    defaultMessage: 'CoMapeo Settings',
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
    id: 'Screens.Settings.AppSettings.createTestData',
    defaultMessage: 'Create Test Data',
  },
  dataAndPrivacy: {
    id: '$1Screens.Settings.AppSettings.dataAndPrivacy',
    defaultMessage: 'Data & Privacy',
  },
  metric: {
    id: '$1Screens.Settings.AppSettings.metric',
    defaultMessage: 'Metric',
  },
  imperial: {
    id: '$1Screens.Settings.AppSettings.imperial',
    defaultMessage: 'Imperial',
  },
  deviceName: {
    id: '$1Screens.Settings.AppSettings.deviceName',
    defaultMessage: 'Device Name',
  },
  language: {
    id: '$1Screens.Settings.AppSettings.language',
    defaultMessage: 'Language',
  },
  coordinateSystem: {
    id: '$1Screens.Settings.AppSettings.coordinateSystem',
    defaultMessage: 'Coordinate System',
  },
  unitSystem: {
    id: '$1Screens.Settings.AppSettings.unitSystem',
    defaultMessage: 'Unit System',
  },
  earlyAccess: {
    id: '$1Screens.Settings.AppSettings.earlyAccess',
    defaultMessage: 'Early Access',
  },
  learnMore: {
    id: '$1Screens.Settings.AppSettings.learnMore',
    defaultMessage: 'Learn More',
  },
  testData: {
    id: 'Screens.Settings.AppSettings.testData',
    defaultMessage: 'Test Data',
  },
  qaDeviceName: {
    id: 'Screens.Settings.AppSettings.qaDeviceName',
    defaultMessage: 'QA Device Name',
  },
});

export const AppSettings: NativeNavigationComponent<'AppSettings'> = ({
  navigation,
}) => {
  const {formatMessage} = useIntl();
  const {authState} = useAuthContext();
  const isEarlyAccess = useEarlyAccessState(s => s.isEarlyAccessEnabled);
  const coordinateFormat = useCoordinateFormat();
  const appLocale = useLocaleState(s => s.languageTag);
  const passcode = useSecurityState(s => s.passcode);
  const {data: deviceInfo} = useOwnDeviceInfo();
  const unitSystem = useUnitSystem();

  const currentLanguageName =
    USABLE_LANGUAGES.find(l => l.languageTag === appLocale)?.nativeName ??
    appLocale;

  const coordinateLabel = {
    utm: formatMessage(m.coordinateUtm),
    dd: formatMessage(m.coordinateDd),
    dms: formatMessage(m.coordinateDms),
  }[coordinateFormat];

  const hasPasscode = passcode !== null;
  const qaDeviceName = useQADeviceName();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BodyText variant="tinyMeta" style={styles.sectionHeader}>
        {formatMessage(m.deviceName)}
      </BodyText>

      <SettingsRow
        testID="device-name-list-item"
        onPress={() => navigation.navigate('DeviceNameDisplay')}
        label={deviceInfo?.name ?? ''}
        Icon={
          <MaterialIcon name="phone-android" size={24} color={NEW_DARK_GREY} />
        }
        EndContent={
          <BodyText variant="tinyMeta" style={styles.actionText}>
            {formatMessage(m.edit)}
          </BodyText>
        }
      />
      <BodyText variant="tinyMeta" style={styles.sectionHeader}>
        {formatMessage(m.language)}
      </BodyText>
      <SettingsRow
        testID="languageSettingsButton"
        onPress={() => navigation.navigate('LanguageSettings')}
        label={currentLanguageName}
        Icon={<MaterialIcon name="language" size={24} color={NEW_DARK_GREY} />}
        EndContent={
          <MaterialIcon name="chevron-right" size={20} color={NEW_DARK_GREY} />
        }
      />
      <BodyText variant="tinyMeta" style={styles.sectionHeader}>
        {formatMessage(m.coordinateSystem)}
      </BodyText>
      <SettingsRow
        testID="settingsCoodinatesButton"
        onPress={() => navigation.navigate('CoordinateFormat')}
        label={coordinateLabel}
        Icon={<MaterialIcon name="explore" size={24} color={NEW_DARK_GREY} />}
        EndContent={
          <MaterialIcon name="chevron-right" size={20} color={NEW_DARK_GREY} />
        }
      />
      <BodyText variant="tinyMeta" style={styles.sectionHeader}>
        {formatMessage(m.unitSystem)}
      </BodyText>
      <SettingsRow
        testID="unitSystemButton"
        onPress={() => {
          navigation.navigate('UnitSystemSettings');
        }}
        label={
          unitSystem === 'metric'
            ? formatMessage(m.metric)
            : formatMessage(m.imperial)
        }
        Icon={<AngleRulerIcon width={24} height={24} />}
        EndContent={
          <MaterialIcon name="chevron-right" size={20} color={NEW_DARK_GREY} />
        }
      />
      {process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI && (
        <>
          <BodyText variant="tinyMeta" style={styles.sectionHeader}>
            {formatMessage(m.testData)}
          </BodyText>
          <SettingsRow
            onPress={() => navigation.navigate('CreateTestData')}
            label={formatMessage(m.createTestData)}
            Icon={
              <MaterialIcon
                name="auto-fix-high"
                size={24}
                color={NEW_DARK_GREY}
              />
            }
            EndContent={
              <MaterialIcon
                name="chevron-right"
                size={20}
                color={NEW_DARK_GREY}
              />
            }
          />
        </>
      )}
      {isQABuild && (
        <SettingsRow
          onPress={() => navigation.navigate('EditQADeviceName')}
          label={`${formatMessage(m.qaDeviceName)}${qaDeviceName ? `: ${qaDeviceName}` : ''}`}
          Icon={<MaterialIcon name="devices" size={24} color={NEW_DARK_GREY} />}
          EndContent={
            <MaterialIcon
              name="chevron-right"
              size={20}
              color={NEW_DARK_GREY}
            />
          }
        />
      )}

      <View style={styles.divider} />

      {authState !== 'obscured' && (
        <>
          <BodyText variant="tinyMeta" style={styles.sectionHeader}>
            {formatMessage(m.passcode)}
          </BodyText>
          <SettingsRow
            testID="securitySettingsButton"
            onPress={() => navigation.navigate('Security')}
            label={
              hasPasscode
                ? formatMessage(m.passcode)
                : formatMessage(m.noPasscode)
            }
            Icon={
              <MaterialIcon name="security" size={24} color={NEW_DARK_GREY} />
            }
            EndContent={
              <BodyText variant="tinyMeta" style={styles.actionText}>
                {hasPasscode
                  ? formatMessage(m.turnOff)
                  : formatMessage(m.turnOn)}
              </BodyText>
            }
          />
        </>
      )}

      <BodyText variant="tinyMeta" style={styles.sectionHeader}>
        {formatMessage(m.earlyAccess)}
      </BodyText>
      <SettingsRow
        testID="earlyAccessFlag"
        labelTestID="earlyAccessFlagLabel"
        onPress={() => navigation.navigate('EarlyAccess')}
        label={
          isEarlyAccess
            ? formatMessage(m.earlyAccessOn)
            : formatMessage(m.earlyAccessOff)
        }
        Icon={<MaterialIcon name="flag" size={24} color={NEW_DARK_GREY} />}
        EndContent={
          <BodyText variant="tinyMeta" style={styles.actionText}>
            {isEarlyAccess ? formatMessage(m.turnOff) : formatMessage(m.turnOn)}
          </BodyText>
        }
      />

      <View style={styles.divider} />

      <BodyText variant="tinyMeta" style={styles.sectionHeader}>
        {formatMessage(m.dataAndPrivacy)}
      </BodyText>

      <SettingsRow
        testID="dataAndPrivacyButton"
        onPress={() => navigation.navigate('DataAndPrivacy')}
        label={formatMessage(m.dataAndPrivacy)}
        Icon={<HeartCheckIcon width={24} height={24} />}
        EndContent={
          <MaterialIcon name="chevron-right" size={20} color={NEW_DARK_GREY} />
        }
      />

      <View style={styles.divider} />

      <BodyText variant="tinyMeta" style={styles.sectionHeader}>
        {formatMessage(m.learnMore)}
      </BodyText>

      <SettingsRow
        testID="aboutSettingsButton"
        onPress={() => navigation.navigate('AboutSettings')}
        label={formatMessage(m.aboutCoMapeo)}
        Icon={
          <MaterialIcon name="info-outline" size={24} color={NEW_DARK_GREY} />
        }
        EndContent={
          <MaterialIcon name="chevron-right" size={20} color={NEW_DARK_GREY} />
        }
      />
    </ScrollView>
  );
};

AppSettings.navTitle = m.title;

function SettingsRow({
  label,
  onPress,
  testID,
  labelTestID,
  Icon,
  EndContent,
}: {
  label: string;
  onPress: () => void;
  testID?: string;
  labelTestID?: string;
  Icon: React.ReactNode;
  EndContent: React.ReactNode;
}) {
  return (
    <TouchableOpacity testID={testID} onPress={onPress} style={styles.row}>
      {Icon}
      <HeaderText
        variant="header6"
        style={styles.rowLabel}
        testID={labelTestID}>
        {label}
      </HeaderText>
      {EndContent}
    </TouchableOpacity>
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
