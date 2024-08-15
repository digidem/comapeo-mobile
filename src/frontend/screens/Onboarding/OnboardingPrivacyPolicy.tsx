import * as React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {PrivacyPolicy} from '../PrivacyPolicy';
import {BLUE_GREY, WHITE} from '../../lib/styles';
import {PermissionToggle} from '../../sharedComponents/PermissionToggle';
import {usePermissionToggle} from '../../hooks/usePermissionToggle';

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
  const {isPermissionEnabled, togglePermission} = usePermissionToggle();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <PrivacyPolicy />
      <View style={styles.horizontalLine} />
      <Text style={styles.header}>{formatMessage(m.permissionsTitle)}</Text>
      <View style={styles.permissionToggleContainer}>
        <PermissionToggle
          isPermissionEnabled={isPermissionEnabled}
          togglePermission={togglePermission}
        />
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
