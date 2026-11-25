import {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {
  getDiagnosticsEnabled,
  setDiagnosticsEnabled,
} from '@comapeo/core-react-native/sentry';
import {WHITE, BLACK} from '../lib/styles';
import {Checkbox} from './Checkbox';
import {BodyText} from './Text/BodyText';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';

const m = defineMessages({
  shareDiagnostics: {
    id: '$1screens.OnboardingPrivacyPolicy.shareDiagnostics',
    defaultMessage: 'Share Diagnostic Information',
  },
});

export const MetricsDiagnosticsPermissionToggle = () => {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();
  // this value is not reactive
  const nonReactiveDiagnosticsEnabled = getDiagnosticsEnabled();
  const [reactiveDiagnosticsEnabled, setReactiveDiagnosticsEnabled] = useState(
    nonReactiveDiagnosticsEnabled,
  );

  return (
    <View style={styles.container}>
      <BodyText style={styles.permissionText}>
        {formatMessage(m.shareDiagnostics)}
      </BodyText>
      <Checkbox
        value={reactiveDiagnosticsEnabled}
        error={false}
        onPress={() => {
          const newDiagnosticEnabledValue = !reactiveDiagnosticsEnabled;
          setDiagnosticsEnabled(newDiagnosticEnabledValue);
          setReactiveDiagnosticsEnabled(newDiagnosticEnabledValue);
          navigation.navigate('MetricsResetWarning', {
            metric: 'diagnostics',
            sharing: newDiagnosticEnabledValue ? 'on' : 'off',
          });
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
    color: BLACK,
    flex: 1,
  },
});
