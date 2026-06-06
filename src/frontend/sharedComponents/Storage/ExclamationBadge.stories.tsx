import type {Meta, StoryObj} from '@storybook/react-native';
import {ExclamationBadge} from './ExclamationBadge';

const meta = {
  title: 'Shared/ExclamationBadge',
  component: ExclamationBadge,
} satisfies Meta<typeof ExclamationBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    testID: 'exclamation-badge',
  },
};
