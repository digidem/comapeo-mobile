import * as React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {PrivacyPolicy} from '../PrivacyPolicy';
import {BLACK, BLUE_GREY, WHITE} from '../../lib/styles';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {Checkbox} from '../../sharedComponents/Checkbox';
import {
  getDiagnosticsEnabled,
  setDiagnosticsEnabled,
} from '@comapeo/core-react-native/sentry';

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
    id: '$1screens.OnboardingPrivacyPolicy.shareDiagnostics',
    defaultMessage: 'Share Diagnostic Information',
  },
});

export const OnboardingPrivacyPolicy = () => {
  const {formatMessage} = useIntl();
  //this is a non-reactive value
  const nonReactiveDiagnosticsEnabled = getDiagnosticsEnabled();
  const [isEnabled, setIsEnabled] = React.useState(
    nonReactiveDiagnosticsEnabled,
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <PrivacyPolicy />
      <View style={styles.horizontalLine} />
      <HeaderText variant="header2" style={styles.header}>
        {formatMessage(m.permissionsTitle)}
      </HeaderText>
      <View style={styles.permissionToggleContainer}>
        <View style={styles.container}>
          <Text style={styles.permissionText}>
            {formatMessage(m.shareDiagnostics)}
          </Text>
          <Checkbox
            value={isEnabled}
            error={false}
            onPress={() => {
              const newIsEnabledValue = !isEnabled;
              setDiagnosticsEnabled(newIsEnabledValue);
              setIsEnabled(newIsEnabledValue);
            }}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

OnboardingPrivacyPolicy.navTitle = m.navTitle;

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  horizontalLine: {
    borderBottomColor: BLUE_GREY,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  header: {
    marginBottom: 20,
  },
  permissionToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
  },
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
