import * as React from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {StyleSheet, Text} from 'react-native';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

const m = defineMessages({
  navTitle: {
    id: 'screens.AppPasscode',
    defaultMessage: 'App Passcode',
  },
  title: {
    id: 'screens.AppPasscode.NewPasscode.Splash.title',
    defaultMessage: 'What is App Passcode?',
  },
  passcodeDescription: {
    id: 'screens.AppPasscode.PasscodeIntro.description',
    defaultMessage:
      'App Passcode allows you to add an additional layer of security by requiring that you enter a passcode in order to open the CoMapeo app. You can define your own 5-digit passcode by turning on the feature below.',
  },
  warning: {
    id: 'screens.AppPasscode.PasscodeIntro.warning',
    defaultMessage:
      '<bold>Please note that forgotten passcodes cannot be recovered!</bold> Once this feature is enabled, if you forget or lose your passcode, you will not be able to open CoMapeo and will lose access to any CoMapeo data that has not been synced with other project participants.',
  },
  continue: {
    id: 'screens.AppPasscode.NewPasscode.Splash.continue',
    defaultMessage: 'Continue',
  },
});

export const AppPasscode: NativeNavigationComponent<'AppPasscode'> = () => {
  const {formatMessage: t} = useIntl();
  const {navigate} = useNavigationFromRoot();

  return (
    <ScreenContentWithDock
      dockContent={
        <PrimaryButton
          fullSize
          onPress={() => navigate('SetPasscode')}
          text={t(m.continue)}
        />
      }
      contentContainerStyle={styles.contentContainer}>
      <HeaderText variant="header1" style={styles.title}>
        {t(m.title)}
      </HeaderText>
      <BodyText>{t(m.passcodeDescription)}</BodyText>
      <BodyText>
        <FormattedMessage
          {...m.warning}
          values={{
            bold: (chunks: React.ReactNode) => (
              <Text key="bold" style={{fontWeight: 'bold'}}>
                {chunks}
              </Text>
            ),
          }}
        />
      </BodyText>
    </ScreenContentWithDock>
  );
};

AppPasscode.navTitle = m.navTitle;

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
  },
  title: {
    textAlign: 'center',
  },
});
