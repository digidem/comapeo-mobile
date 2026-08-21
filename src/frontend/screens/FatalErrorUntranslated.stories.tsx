import type {Meta, StoryObj} from '@storybook/react-native';
import {FatalErrorUntranslated} from './FatalErrorUntranslated';

const meta = {
  title: 'Screens/FatalErrorUntranslated',
  component: FatalErrorUntranslated,
  parameters: {
    controls: {disable: true},
  },
} satisfies Meta<typeof FatalErrorUntranslated>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FatalErrorUntranslated />,
};
