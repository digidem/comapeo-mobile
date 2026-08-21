import type {Meta, StoryObj} from '@storybook/react-native';
import {GPSPillUI} from './GPSPillUI';
import {View} from 'react-native';

const meta = {
  title: 'Shared/GPSPill',
  component: GPSPillUI,
} satisfies Meta<typeof GPSPillUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Searching: Story = {
  args: {
    status: 'searching',
    unitSystem: 'metric',
  },
};

export const Good: Story = {
  args: {
    status: 'good',
    accuracy: 10,
    unitSystem: 'metric',
  },
};

export const GoodImperial: Story = {
  args: {
    status: 'good',
    accuracy: 10,
    unitSystem: 'imperial',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    unitSystem: 'metric',
  },
};

export const AllStates: Story = {
  args: {
    status: 'searching',
    unitSystem: 'metric',
  },
  render: () => (
    <View style={{flexDirection: 'row', gap: 12, padding: 16}}>
      <GPSPillUI status="searching" unitSystem="metric" />
      <GPSPillUI status="good" accuracy={10} unitSystem="metric" />
      <GPSPillUI status="error" unitSystem="metric" />
    </View>
  ),
};
