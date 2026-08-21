import type {Meta, StoryObj} from '@storybook/react-native';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';

const meta = {
  title: 'Shared/DeviceNameWithIcon',
  component: DeviceNameWithIcon,
} satisfies Meta<typeof DeviceNameWithIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  args: {
    name: 'Android Phone',
    deviceType: 'mobile',
    deviceConnectionStatus: 'connected',
  },
};

export const Disconnected: Story = {
  args: {
    name: 'Field Tablet',
    deviceType: 'tablet',
    deviceConnectionStatus: 'disconnected',
  },
};

export const ThisDevice: Story = {
  args: {
    name: 'My Device',
    deviceType: 'mobile',
    thisDevice: true,
  },
};

export const WithDeviceId: Story = {
  args: {
    name: 'Remote Device',
    deviceType: 'desktop',
    deviceId: 'abc123def456ghi789',
    deviceConnectionStatus: 'connected',
  },
};
