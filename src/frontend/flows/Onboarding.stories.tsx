import type {InitialState} from '@react-navigation/native';
import type {Meta, StoryObj} from '@storybook/react-native';
import {withRealNavigator} from '../../../.rnstorybook/decorators/withRealNavigator';
import {FLOW_STATES} from '../../../.rnstorybook/utils/flowState';

/**
 * The real navigator renders the journey; this placeholder only satisfies
 * Storybook's component requirement.
 */
const NoStoryComponent = () => null;

const meta = {
  title: 'Flows/Onboarding',
  component: NoStoryComponent,
  decorators: [withRealNavigator],
} satisfies Meta<typeof NoStoryComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const introState: InitialState = {
  routes: [{name: 'IntroToCoMapeo'}],
  index: 0,
};

const dataPrivacyState: InitialState = {
  routes: [{name: 'DataPrivacy'}],
  index: 0,
};

const privacyPolicyState: InitialState = {
  routes: [{name: 'DataPrivacy'}, {name: 'OnboardingPrivacyPolicy'}],
  index: 1,
};

const deviceNamingState: InitialState = {
  routes: [{name: 'DeviceNaming'}],
  index: 0,
};

const successState: InitialState = {
  routes: [{name: 'Success'}],
  index: 0,
};

const joinProjectIntroState: InitialState = {
  routes: [{name: 'Success'}, {name: 'JoinProjectIntro'}],
  index: 1,
};

const mapOnYourOwnIntroState: InitialState = {
  routes: [{name: 'Success'}, {name: 'MapOnYourOwnIntro'}],
  index: 1,
};

/**
 * The complete first-launch journey. The canonical walkthrough follows the
 * Map On Your Own branch after Success. Completing DeviceNaming mutates real
 * backend state, so re-apply freshInstall before replaying this story.
 */
export const Walkthrough: Story = {
  parameters: {
    flow: {state: FLOW_STATES.freshInstall},
  },
};

/** The first onboarding screen shown after a fresh install. */
export const Intro: Story = {
  name: '01 Intro',
  parameters: {
    flow: {state: FLOW_STATES.freshInstall, initialState: introState},
  },
};

/** The onboarding data-privacy explanation after Intro. */
export const DataPrivacy: Story = {
  name: '02 Data Privacy',
  parameters: {
    flow: {state: FLOW_STATES.freshInstall, initialState: dataPrivacyState},
  },
};

/** The privacy-policy screen reached from Data Privacy. */
export const PrivacyPolicy: Story = {
  name: '03 Privacy Policy',
  parameters: {
    flow: {
      state: FLOW_STATES.freshInstall,
      initialState: privacyPolicyState,
    },
  },
};

/** The device-name form reached after accepting the privacy screens. */
export const DeviceNaming: Story = {
  name: '04 Device Naming',
  parameters: {
    flow: {state: FLOW_STATES.freshInstall, initialState: deviceNamingState},
  },
};

/** The success screen shown after naming the device. */
export const Success: Story = {
  name: '05 Success',
  parameters: {
    flow: {state: FLOW_STATES.namedNoProject, initialState: successState},
  },
};

/** The branch reached when the user chooses Join a Project at Success. */
export const JoinProjectIntro: Story = {
  name: '06a Join Project Intro',
  parameters: {
    flow: {
      state: FLOW_STATES.namedNoProject,
      initialState: joinProjectIntroState,
    },
  },
};

/** The canonical branch reached when the user chooses Map On Your Own. */
export const MapOnYourOwnIntro: Story = {
  name: '06b Map On Your Own Intro',
  parameters: {
    flow: {
      state: FLOW_STATES.namedNoProject,
      initialState: mapOnYourOwnIntroState,
    },
  },
};
