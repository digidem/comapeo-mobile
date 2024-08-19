import * as React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import CoMapeoShield from '../../../images/CoMapeoShield.svg';
import {
  BLUE_GREY,
  WHITE,
  BLACK,
  COMAPEO_BLUE,
  NEW_DARK_GREY,
} from '../../../lib/styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../../sharedTypes/navigation';
import {useIntl, defineMessages} from 'react-intl';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {MetricsDiagnosticsPermissionToggle} from '../../../sharedComponents/MetricsDiagnosticsPermissionToggle';
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
});

export const DataAndPrivacy = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'DataAndPrivacy'>) => {
  const {formatMessage} = useIntl();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.shieldContainer}>
        <CoMapeoShield width={24} height={30} />
        <View style={styles.shieldTextContainer}>
          <Text style={styles.respectsPrivacy}>
            {formatMessage(m.respectsPrivacy)}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingsPrivacyPolicy')}>
            <Text style={styles.learnMore}>{formatMessage(m.learnMore)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.diagnosticContainer}>
        <Text style={styles.diagnosticTitle}>
          {formatMessage(m.diagnosticInfoTitle)}
        </Text>
        <Text style={styles.diagnosticText}>
          {formatMessage(m.diagnosticInfoText)}
        </Text>
        <View style={styles.bulletContainer}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>{formatMessage(m.noPII)}</Text>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>{formatMessage(m.optOut)}</Text>
        </View>
        <View style={styles.horizontalLine} />
        <MetricsDiagnosticsPermissionToggle />
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
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK,
  },
  learnMore: {
    fontSize: 16,
    color: COMAPEO_BLUE,
  },
  diagnosticContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    backgroundColor: WHITE,
    gap: 10,
  },
  diagnosticTitle: {
    fontSize: 16,
    color: BLACK,
  },
  diagnosticText: {
    fontSize: 14,
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
    fontSize: 14,
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
