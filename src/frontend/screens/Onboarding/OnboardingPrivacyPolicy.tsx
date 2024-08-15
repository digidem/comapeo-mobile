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
import {createPersistedPermissionStore} from '../../hooks/persistedState/usePersistedPermission';
import {useMetrics} from '../../contexts/MetricsContext';

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
  const {formatMessage} = useIntl();
  const {appMetrics, deviceMetrics} = useMetrics();

  const usePersistedPermission = createPersistedPermissionStore(
    appMetrics,
    deviceMetrics,
  );
  const {isPermissionEnabled, togglePermission} = usePersistedPermission();

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
          onPress={togglePermission}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={[
            styles.checkBox,
            isPermissionEnabled && styles.checkBoxChecked,
          ]}>
          {isPermissionEnabled && (
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
    paddingVertical: 20,
    paddingHorizontal: 30,
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
