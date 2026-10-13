import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {
  getDiagnosticsEnabled,
  setDiagnosticsEnabled,
} from '@comapeo/core-react-native/sentry';
import {WHITE, BLACK} from '../lib/styles';
import {Checkbox} from './Checkbox';

const m = defineMessages({
  shareDiagnostics: {
    id: '$1screens.OnboardingPrivacyPolicy.shareDiagnostics',
    defaultMessage: 'Share Diagnostic Information',
  },
});

export const MetricsDiagnosticsPermissionToggle: React.FC = () => {
  const {formatMessage} = useIntl();
  // this value is not reactive
  const nonReactiveDiagnosticsEnabled = getDiagnosticsEnabled();
  const [reactiveDiagnosticsEnabled, setReactiveDiagnosticsEnabled] =
    React.useState(nonReactiveDiagnosticsEnabled);

  return (
    <View style={styles.container}>
      <Text style={styles.permissionText}>
        {formatMessage(m.shareDiagnostics)}
      </Text>
      <Checkbox
        value={reactiveDiagnosticsEnabled}
        error={false}
        onPress={() => {
          const newDiagnosticEnabledValue = !reactiveDiagnosticsEnabled;
          setDiagnosticsEnabled(newDiagnosticEnabledValue);
          setReactiveDiagnosticsEnabled(newDiagnosticEnabledValue);
        }}
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
