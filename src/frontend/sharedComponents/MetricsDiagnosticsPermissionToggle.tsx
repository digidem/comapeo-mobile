import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {BLUE_GREY, WHITE, BLACK, COMAPEO_BLUE} from '../lib/styles';
import {usePersistedMetricDiagnosticsPermission} from '../hooks/persistedState/usePersistedMetricDiagnosticsPermission';
import {Checkbox} from './Checkbox';

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
      <Checkbox isChecked={isEnabled} onPress={togglePermission} />
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
