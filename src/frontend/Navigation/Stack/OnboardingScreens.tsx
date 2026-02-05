import * as React from 'react';
import {RootStack} from '.';
import {IntroToCoMapeo} from '../../screens/Onboarding/IntroToCoMapeo';
import {DataPrivacy} from '../../screens/Onboarding/DataPrivacy';
import {OnboardingPrivacyPolicy} from '../../screens/Onboarding/OnboardingPrivacyPolicy';
import {DeviceNaming} from '../../screens/Onboarding/DeviceNaming';
import {Success} from '../../screens/Onboarding/Success';
import {JoinProjectIntro} from '../../screens/Onboarding/JoinProjectIntro';
import {MapOnYourOwnIntro} from '../../screens/Onboarding/MapOnYourOwnIntro';
import {MessageDescriptor} from 'react-intl';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {InviteReceived} from '../../screens/Invites/InviteReceived';
import {InviteSuccessfullyAccepted} from '../../screens/Invites/InviteSuccessfullyAccepted';
import {InviteCanceled} from '../../screens/Invites/InviteCanceled';

export const createOnboardingScreens = ({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) => (
  <>
    <RootStack.Group key="onboarding">
      <RootStack.Screen
        name="IntroToCoMapeo"
        component={IntroToCoMapeo}
        options={{headerShown: false, statusBarStyle: 'light'}}
      />
      <RootStack.Screen
        name="DataPrivacy"
        component={DataPrivacy}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="OnboardingPrivacyPolicy"
        component={OnboardingPrivacyPolicy}
        options={{headerTitle: intl(OnboardingPrivacyPolicy.navTitle)}}
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
    <RootStack.Group
      screenOptions={{
        presentation: 'transparentModal',
        headerShown: false,
        animation: 'none',
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <RootStack.Screen name="ErrorBottomSheet" component={ErrorBottomSheet} />
      <RootStack.Screen name="InviteReceived" component={InviteReceived} />
      <RootStack.Screen
        name="InviteSuccessfullyAccepted"
        component={InviteSuccessfullyAccepted}
      />
      <RootStack.Screen name="InviteCanceled" component={InviteCanceled} />
    </RootStack.Group>
  </>
);
