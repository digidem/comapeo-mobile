import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import {AppDiagnosticMetrics} from '../../../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../../../metrics/DeviceDiagnosticMetrics';

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
  shareDiagnostics: {
    id: 'screens.OnboardingPrivacyPolicy.shareDiagnostics',
    defaultMessage: 'Share Diagnostic Information',
  },
});

export const DataAndPrivacy = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'DataAndPrivacy'>) => {
  const {formatMessage} = useIntl();
  const appDiagnosticMetrics = new AppDiagnosticMetrics();
  const deviceDiagnosticMetrics = new DeviceDiagnosticMetrics();
  const [isDiagnosticsEnabled, setIsDiagnosticsEnabled] = React.useState(false);

  const toggleDiagnostics = () => {
    setIsDiagnosticsEnabled(prev => !prev);
  };

  React.useEffect(() => {
    appDiagnosticMetrics.setEnabled(isDiagnosticsEnabled);
    deviceDiagnosticMetrics.setEnabled(isDiagnosticsEnabled);
  }, [isDiagnosticsEnabled]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.shieldContainer}>
        <CoMapeoShield width={40} height={40} />
        <View style={styles.shieldTextContainer}>
          <Text style={styles.respectsPrivacy}>
            {formatMessage(m.respectsPrivacy)}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}>
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
          <Text style={styles.bulletText}>
            {`This never includes any of your data or personal information.`}
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>
            {`You can opt-out of sharing diagnostic information at any time.`}
          </Text>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.diagnosticPermissionContainer}>
          <Text style={styles.permissionText}>
            {formatMessage(m.shareDiagnostics)}
          </Text>
          <TouchableOpacity
            onPress={toggleDiagnostics}
            style={[
              styles.checkBox,
              isDiagnosticsEnabled && styles.checkBoxChecked,
            ]}>
            {isDiagnosticsEnabled && (
              <MaterialIcons name="check" size={18} color={WHITE} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: WHITE,
  },
  shieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    backgroundColor: WHITE,
    marginBottom: 20,
  },
  shieldTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  respectsPrivacy: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK,
    marginBottom: 5,
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
  },
  diagnosticTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK,
    marginBottom: 10,
  },
  diagnosticText: {
    fontSize: 14,
    color: NEW_DARK_GREY,
    marginBottom: 10,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bulletIcon: {
    marginTop: 5,
    marginRight: 10,
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
    marginHorizontal: -20,
  },
  diagnosticPermissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  permissionText: {
    fontSize: 16,
    color: BLACK,
    flex: 1,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxChecked: {
    backgroundColor: COMAPEO_BLUE,
    borderColor: COMAPEO_BLUE,
  },
});

DataAndPrivacy.navTitle = m.navTitle;
