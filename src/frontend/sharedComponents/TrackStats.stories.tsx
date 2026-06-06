import type {Meta, StoryObj} from '@storybook/react-native';
import {TrackStats} from './TrackStats';

const meta = {
  title: 'Shared/TrackStats',
  component: TrackStats,
} satisfies Meta<typeof TrackStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    distance: 2500,
    durationMs: 3600000,
  },
};
