import type {Meta, StoryObj} from '@storybook/react-native';
import {LocationView} from './LocationView';

const meta = {
  title: 'Shared/LocationView',
  component: LocationView,
} satisfies Meta<typeof LocationView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lat: 40.7128,
    lon: -74.006,
    accuracy: 10,
  },
};
