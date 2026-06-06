import type {Meta, StoryObj} from '@storybook/react-native';
import {MapShareCanceled} from './MapShareCanceled';

const meta = {
  title: 'Shared/MapShareCanceled',
  component: MapShareCanceled,
} satisfies Meta<typeof MapShareCanceled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => {},
  },
};
