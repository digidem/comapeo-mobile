import type {Meta, StoryObj} from '@storybook/react-native';
import {RoleWithIcon} from './RoleWithIcon';

const meta = {
  title: 'Shared/RoleWithIcon',
  component: RoleWithIcon,
} satisfies Meta<typeof RoleWithIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Coordinator: Story = {
  args: {
    role: 'coordinator',
  },
};

export const Participant: Story = {
  args: {
    role: 'participant',
  },
};
