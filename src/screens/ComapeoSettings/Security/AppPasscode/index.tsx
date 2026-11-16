import * as React from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {ScreenContentWithButtonDock} from '../../../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDock';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';
import {PrimaryButton} from '../../../../sharedComponents/Buttons';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';

const m = defineMessages({
  navTitle: {
    id: '$1screens.AppPasscode',
    defaultMessage: 'App Passcode',
  },
  title: {
    id: '$1screens.AppPasscode.NewPasscode.Splash.title',
    defaultMessage: 'What is App Passcode?',
  },
  passcodeDescription: {
    id: '$1screens.AppPasscode.PasscodeIntro.description',
    defaultMessage:
      'App Passcode allows you to add an additional layer of security by requiring that you enter a passcode in order to open the CoMapeo app. You can define your own 5-digit passcode by turning on the feature below.',
  },
  warning: {
    id: '$1screens.AppPasscode.PasscodeIntro.warning',
    defaultMessage:
      '<bold>Please note that forgotten passcodes cannot be recovered!</bold> Once this feature is enabled, if you forget or lose your passcode, you will not be able to open CoMapeo and will lose access to any CoMapeo data that has not been exchanged with other project participants.',
  },
  continue: {
    id: '$1screens.AppPasscode.NewPasscode.Splash.continue',
    defaultMessage: 'Continue',
  },
});

export const AppPasscode: NativeNavigationComponent<'AppPasscode'> = () => {
  const {formatMessage: t} = useIntl();
  const {navigate} = useNavigationFromRoot();

  return (
    <ScreenContentWithButtonDock
      bottomButton={
        <PrimaryButton
          fullSize
          onPress={() => navigate('SetPasscode')}
          text={t(m.continue)}
        />
      }
      contentContainerStyle={{gap: 20}}>
      <HeaderText variant="header1" style={{textAlign: 'center'}}>
        {t(m.title)}
      </HeaderText>
      <BodyText>{t(m.passcodeDescription)}</BodyText>
      <BodyText>
        <FormattedMessage
          {...m.warning}
          values={{
            bold: (chunks: React.ReactNode) => (
              <BodyText key={chunks?.toString()} weight={700}>
                {chunks}
              </BodyText>
            ),
          }}
        />
      </BodyText>
    </ScreenContentWithButtonDock>
  );
};

AppPasscode.navTitle = m.navTitle;
