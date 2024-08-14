import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {PrivacyPolicy} from '../PrivacyPolicy';
import {BLUE_GREY, WHITE, BLACK, COMAPEO_BLUE} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {AppDiagnosticMetrics} from '../../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../../metrics/DeviceDiagnosticMetrics';

const m = defineMessages({
  navTitle: {
    id: 'screens.OnboardingPrivacyPolicy.navTitle',
    defaultMessage: 'Privacy Policy',
  },
  permissionsTitle: {
    id: 'screens.OnboardingPrivacyPolicy.permissionsTitle',
    defaultMessage: 'Current Permissions',
  },
  shareDiagnostics: {
    id: 'screens.OnboardingPrivacyPolicy.shareDiagnostics',
    defaultMessage: 'Share Diagnostic Information',
  },
});

export const OnboardingPrivacyPolicy = () => {
  const appDiagnosticMetrics = new AppDiagnosticMetrics();
  const deviceDiagnosticMetrics = new DeviceDiagnosticMetrics();
  const {formatMessage} = useIntl();
  const [isDiagnosticsEnabled, setIsDiagnosticsEnabled] = React.useState(false);

  const toggleDiagnostics = () => {
    setIsDiagnosticsEnabled(prev => !prev);
  };

  React.useEffect(() => {
    appDiagnosticMetrics.setEnabled(isDiagnosticsEnabled);
    deviceDiagnosticMetrics.setEnabled(isDiagnosticsEnabled);
  }, [isDiagnosticsEnabled]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <PrivacyPolicy />
      <View style={styles.horizontalLine} />
      <Text style={styles.header}>{formatMessage(m.permissionsTitle)}</Text>
      <View style={styles.permissionBox}>
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
    </ScrollView>
  );
};

OnboardingPrivacyPolicy.navTitle = m.navTitle;

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 10,
    paddingBottom: 50,
  },
  horizontalLine: {
    borderBottomColor: BLUE_GREY,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  permissionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
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
