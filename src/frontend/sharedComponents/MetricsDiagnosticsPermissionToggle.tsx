import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIntl, defineMessages} from 'react-intl';
import {BLUE_GREY, WHITE, BLACK, COMAPEO_BLUE} from '../lib/styles';
import {usePersistedMetricDiagnosticsPermission} from '../hooks/persistedState/usePersistedMetricDiagnosticsPermission';

const m = defineMessages({
  shareDiagnostics: {
    id: 'screens.OnboardingPrivacyPolicy.shareDiagnostics',
    defaultMessage: 'Share Diagnostic Information',
  },
});

export const MetricsDiagnosticsPermissionToggle: React.FC = () => {
  const {formatMessage} = useIntl();
  const {isEnabled, setIsEnabled} = usePersistedMetricDiagnosticsPermission();

  const togglePermission = () => setIsEnabled(!isEnabled);

  return (
    <View style={styles.container}>
      <Text style={styles.permissionText}>
        {formatMessage(m.shareDiagnostics)}
      </Text>
      <TouchableOpacity
        onPress={togglePermission}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={[styles.checkBox, isEnabled && styles.checkBoxChecked]}>
        {isEnabled && <MaterialIcons name="check" size={18} color={WHITE} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
