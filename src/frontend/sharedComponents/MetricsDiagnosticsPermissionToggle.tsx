import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {WHITE, BLACK} from '../lib/styles';
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
      <Checkbox
        value={isEnabled}
        error={false}
        onPress={togglePermission}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      />
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
});
