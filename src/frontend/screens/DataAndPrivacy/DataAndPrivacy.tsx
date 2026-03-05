import * as React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import CoMapeoShield from '../../images/CoMapeoShield.svg';
import {
  BLUE_GREY,
  WHITE,
  BLACK,
  COMAPEO_BLUE,
  NEW_DARK_GREY,
} from '../../lib/styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useIntl, defineMessages} from 'react-intl';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {MetricsDiagnosticsPermissionToggle} from '../../sharedComponents/MetricsDiagnosticsPermissionToggle';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Checkbox} from '../../sharedComponents/Checkbox';
import {
  useAppUsageStatsActions,
  useAppUsageStatsState,
} from '../../contexts/AppUsageStatsContext';
const m = defineMessages({
  navTitle: {
    id: 'screens.DataAndPrivacy.navTitle',
    defaultMessage: 'Data & Privacy',
  },
  respectsPrivacy: {
    id: 'screens.DataAndPrivacy.respectsPrivacy',
    defaultMessage: 'CoMapeo Respects Your Privacy & Autonomy',
  },
  learnMore: {
    id: 'screens.DataAndPrivacy.learnMore',
    defaultMessage: 'Learn More',
  },
  diagnosticInfoTitle: {
    id: 'screens.DataAndPrivacy.diagnosticInfoTitle',
    defaultMessage: 'Diagnostic Information',
  },
  diagnosticInfoText: {
    id: 'screens.DataAndPrivacy.diagnosticInfoText',
    defaultMessage:
      'Anonymized information about your device, app crashes, errors and performance helps Awana Digital improve the app and fix errors.',
  },
  noPII: {
    id: 'screens.DataAndPrivacy.noPII',
    defaultMessage:
      'This never includes any of your data or personal information.',
  },
  optOut: {
    id: 'screens.DataAndPrivacy.optOut',
    defaultMessage:
      'You can opt-out of sharing diagnostic information at any time.',
  },
  appUsageTitle: {
    id: 'screens.DataAndPrivacy.appUsageTitle',
    defaultMessage: 'App Usage',
  },
  appUsageText: {
    id: 'screens.DataAndPrivacy.appUsageText',
    defaultMessage:
      'Share how you use CoMapeo with Awana Digital—no information you share can be used to track you.',
  },
  appUsageId: {
    id: 'screens.DataAndPrivacy.appUsageId',
    defaultMessage:
      'ID numbers are scrambled randomly and changed every month.',
  },
  ipAddress: {
    id: 'screens.DataAndPrivacy.ipAddress',
    defaultMessage: 'CoMapeo never stores IP addresses.',
  },
  shareAppUsage: {
    id: 'screens.DataAndPrivacy.shareAppUsage',
    defaultMessage: 'Share App Usage',
  },
});

export const DataAndPrivacy = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'DataAndPrivacy'>) => {
  const {formatMessage} = useIntl();
  const optInStartedAt = useAppUsageStatsState(store => store.optInStartedAt);
  const {setOptedIn} = useAppUsageStatsActions();

  const appUsageOptedIn = !!optInStartedAt;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.shieldContainer}>
        <CoMapeoShield width={24} height={30} />
        <View style={styles.shieldTextContainer}>
          <HeaderText variant="header5" style={styles.respectsPrivacy}>
            {formatMessage(m.respectsPrivacy)}
          </HeaderText>
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingsPrivacyPolicy')}>
            <HeaderText variant="header5" style={styles.learnMore}>
              {formatMessage(m.learnMore)}
            </HeaderText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemContainer}>
        <HeaderText variant="header5">
          {formatMessage(m.diagnosticInfoTitle)}
        </HeaderText>
        <BodyText variant="smallMeta" style={styles.infoText}>
          {formatMessage(m.diagnosticInfoText)}
        </BodyText>
        <View style={styles.bulletContainer}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <BodyText variant="smallMeta" style={styles.bulletText}>
            {formatMessage(m.noPII)}
          </BodyText>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <BodyText variant="smallMeta" style={styles.bulletText}>
            {formatMessage(m.optOut)}
          </BodyText>
        </View>
        <View style={styles.horizontalLine} />
        <MetricsDiagnosticsPermissionToggle />
      </View>

      <View style={styles.itemContainer}>
        <HeaderText variant="header5">
          {formatMessage(m.appUsageTitle)}
        </HeaderText>
        <BodyText variant="smallMeta" style={styles.infoText}>
          {formatMessage(m.appUsageText)}
        </BodyText>
        <View style={styles.bulletContainer}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <BodyText variant="smallMeta" style={styles.bulletText}>
            {formatMessage(m.appUsageId)}
          </BodyText>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <BodyText variant="smallMeta" style={styles.bulletText}>
            {formatMessage(m.ipAddress)}
          </BodyText>
        </View>
        <View style={styles.horizontalLine} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <HeaderText style={{flex: 1}} variant="header5">
            {formatMessage(m.shareAppUsage)}
          </HeaderText>
          <Checkbox
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            value={appUsageOptedIn}
            onPress={() => setOptedIn(!appUsageOptedIn)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: WHITE,
    gap: 20,
  },
  shieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    backgroundColor: WHITE,
    gap: 20,
  },
  shieldTextContainer: {
    flex: 1,
    gap: 15,
  },
  respectsPrivacy: {
    color: BLACK,
  },
  learnMore: {
    color: COMAPEO_BLUE,
  },
  itemContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    backgroundColor: WHITE,
    gap: 10,
  },
  infoText: {
    color: NEW_DARK_GREY,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 10,
    paddingLeft: 10,
  },
  bulletIcon: {
    marginTop: 10,
  },
  bulletText: {
    color: NEW_DARK_GREY,
    flex: 1,
  },
  horizontalLine: {
    borderBottomColor: BLUE_GREY,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
});

DataAndPrivacy.navTitle = m.navTitle;
