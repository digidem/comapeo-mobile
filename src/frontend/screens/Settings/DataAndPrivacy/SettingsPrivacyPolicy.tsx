import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {PrivacyPolicy} from '../../PrivacyPolicy';

const m = defineMessages({
  navTitle: {
    id: 'screens.SettingsPrivacyPolicy.navTitle',
    defaultMessage: 'Privacy Policy',
  },
});

export const SettingsPrivacyPolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <PrivacyPolicy />
    </ScrollView>
  );
};

SettingsPrivacyPolicy.navTitle = m.navTitle;

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
});
