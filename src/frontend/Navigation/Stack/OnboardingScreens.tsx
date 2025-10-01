import * as React from 'react';
import {RootStack} from '.';
import {IntroToCoMapeo} from '../../screens/Onboarding/IntroToCoMapeo';
import {DataPrivacy} from '../../screens/Onboarding/DataPrivacy';
import {OnboardingPrivacyPolicy} from '../../screens/Onboarding/OnboardingPrivacyPolicy';
import {DeviceNaming} from '../../screens/Onboarding/DeviceNaming';
import {Success} from '../../screens/Onboarding/Success';
import {JoinProjectIntro} from '../../screens/Onboarding/JoinProjectIntro';
import {MapOnYourOwnIntro} from '../../screens/Onboarding/MapOnYourOwnIntro';
import {useIntl} from 'react-intl';

export const OnboardingScreens = () => {
  const {formatMessage} = useIntl();

  return (
    <RootStack.Group key="onboarding">
      <RootStack.Screen
        name="IntroToCoMapeo"
        component={IntroToCoMapeo}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DataPrivacy"
        component={DataPrivacy}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="OnboardingPrivacyPolicy"
        component={OnboardingPrivacyPolicy}
        options={{headerTitle: formatMessage(OnboardingPrivacyPolicy.navTitle)}}
      />
      <RootStack.Screen
        name="DeviceNaming"
        component={DeviceNaming}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="Success"
        component={Success}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="JoinProjectIntro"
        component={JoinProjectIntro}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="MapOnYourOwnIntro"
        component={MapOnYourOwnIntro}
        options={{headerShown: false}}
      />
    </RootStack.Group>
  );
};
