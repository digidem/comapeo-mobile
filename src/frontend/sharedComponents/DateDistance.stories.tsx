import type {Meta, StoryObj} from '@storybook/react-native';
import {DateDistance} from './DateDistance';

const meta = {
  title: 'Shared/DateDistance',
  component: DateDistance,
} satisfies Meta<typeof DateDistance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JustNow: Story = {
  args: {
    date: new Date(),
  },
};

export const OneHourAgo: Story = {
  args: {
    date: new Date(Date.now() - 60 * 60 * 1000),
  },
};

export const Yesterday: Story = {
  args: {
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
};

export const OneWeekAgo: Story = {
  args: {
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
};
