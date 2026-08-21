import type {Meta, StoryObj} from '@storybook/react-native';
import {FatalError} from './FatalError';

/**
 * FatalError screen is a pure component that only uses useIntl()
 * and doesn't need navigation context.
 *
 * Note: The "Restart App" button calls RNRestart.restart() which
 * won't work in Storybook. This story is for visual review only.
 */
const meta = {
  title: 'Screens/FatalError',
  component: FatalError,
  parameters: {
    // Prevent actual app restart on button press
    controls: {disable: true},
  },
} satisfies Meta<typeof FatalError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FatalError />,
};
