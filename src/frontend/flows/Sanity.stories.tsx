import type {Meta, StoryObj} from '@storybook/react-native';
import {withRealNavigator} from '../../../.rnstorybook/decorators/withRealNavigator';
import {FLOW_STATES} from '../../../.rnstorybook/utils/flowState';

/**
 * Sanity stories for the `withRealNavigator` decorator (PRD Task 2.3/2.4).
 *
 * The story function renders nothing — `withRealNavigator` mounts the real
 * navigator and ignores the story's rendered output entirely (see that
 * decorator's docblock). `NoStoryComponent` exists only to satisfy
 * Storybook's `component` requirement.
 */
const NoStoryComponent = () => null;

const meta = {
  title: 'Flows/_Sanity',
  component: NoStoryComponent,
  decorators: [withRealNavigator],
} satisfies Meta<typeof NoStoryComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Passes when it lands on IntroToCoMapeo unprompted. */
export const FreshInstall: Story = {
  name: 'Fresh Install',
  parameters: {
    flow: {state: FLOW_STATES.freshInstall},
  },
};

/** Passes when it lands on Home. Expect map-surface caveats (PRD Risk 3). */
export const Onboarded: Story = {
  parameters: {
    flow: {state: FLOW_STATES.onboardedWithData},
  },
};
