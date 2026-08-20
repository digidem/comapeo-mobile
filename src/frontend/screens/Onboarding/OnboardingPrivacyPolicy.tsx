import * as React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {PrivacyPolicy} from '../PrivacyPolicy';
import {BLUE_GREY, WHITE} from '../../lib/styles';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {MetricsDiagnosticsPermissionToggle} from '../../sharedComponents/MetricsDiagnosticsPermissionToggle';

const m = defineMessages({
  navTitle: {
    id: 'screens.OnboardingPrivacyPolicy.navTitle',
    defaultMessage: 'Privacy Policy',
  },
  permissionsTitle: {
    id: 'screens.OnboardingPrivacyPolicy.permissionsTitle',
    defaultMessage: 'Current Permissions',
  },
});

export const OnboardingPrivacyPolicy = () => {
  const {formatMessage} = useIntl();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <PrivacyPolicy />
      <View style={styles.horizontalLine} />
      <HeaderText variant="header2" style={styles.header}>
        {formatMessage(m.permissionsTitle)}
      </HeaderText>
      <View style={styles.permissionToggleContainer}>
        <MetricsDiagnosticsPermissionToggle />
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
});
