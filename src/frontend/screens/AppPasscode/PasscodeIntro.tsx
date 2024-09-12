import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {Button} from '../../sharedComponents/Button';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';

const m = defineMessages({
  title: {
    id: 'screens.AppPasscode.NewPasscode.Splash.title',
    defaultMessage: 'What is App Passcode?',
  },
  continue: {
    id: 'screens.AppPasscode.NewPasscode.Splash.continue',
    defaultMessage: 'Continue',
  },
  description: {
    id: 'screens.AppPasscode.PasscodeIntro.description',
    defaultMessage:
      'App Passcode allows you to add an additional layer of security by requiring that you enter a passcode in order to open the CoMapeo app. You can define your own 5-digit passcode by turning on the feature below.',
  },
  warning: {
    id: 'screens.AppPasscode.PasscodeIntro.warning',
    defaultMessage:
      '<bold>Please note that forgotten passcodes cannot be recovered!</bold> Once this feature is enabled, if you forget or lose your passcode, you will not be able to open CoMapeo and will lose access to any CoMapeo data that has not been synced with other project participants.',
  },
});

export const PasscodeIntro = () => {
  const {formatMessage: t} = useIntl();
  const {navigate} = useNavigationFromRoot();

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={
        <Button fullWidth onPress={() => navigate('SetPasscode')}>
          {t(m.continue)}
        </Button>
      }>
      <Text style={styles.title}>{t(m.title)}</Text>
      <Text style={styles.description}>{t(m.description)}</Text>
      <Text style={styles.description}>{t(m.warning)}</Text>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
});
