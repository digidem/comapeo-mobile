import type {Meta, StoryObj} from '@storybook/react-native';
import {DeviceIcon} from './DeviceIcon';

const meta = {
  title: 'Shared/DeviceIcon',
  component: DeviceIcon,
} satisfies Meta<typeof DeviceIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  args: {
    deviceType: 'mobile',
    size: 35,
  },
};

export const Tablet: Story = {
  args: {
    deviceType: 'tablet',
    size: 35,
  },
};

export const Desktop: Story = {
  args: {
    deviceType: 'desktop',
    size: 35,
  },
};
