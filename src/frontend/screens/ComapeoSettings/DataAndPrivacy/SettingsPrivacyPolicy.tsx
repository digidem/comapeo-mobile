import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {PrivacyPolicy} from '../../PrivacyPolicy';
import {useBottomPaddingWithSafeArea} from '../../../hooks/useBottomPaddingWithSafeArea';

const m = defineMessages({
  navTitle: {
    id: 'screens.SettingsPrivacyPolicy.navTitle',
    defaultMessage: 'Privacy Policy',
  },
});

export const SettingsPrivacyPolicy = () => {
  const paddingBottom = useBottomPaddingWithSafeArea();

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, {paddingBottom}]}>
      <PrivacyPolicy />
    </ScrollView>
  );
};

SettingsPrivacyPolicy.navTitle = m.navTitle;

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
});
