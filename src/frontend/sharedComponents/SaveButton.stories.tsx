import type {Meta, StoryObj} from '@storybook/react-native';
import {SaveButton} from './SaveButton';

const meta = {
  title: 'Shared/SaveButton',
  component: SaveButton,
} satisfies Meta<typeof SaveButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onPress: () => {},
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onPress: () => {},
    isLoading: true,
  },
};
