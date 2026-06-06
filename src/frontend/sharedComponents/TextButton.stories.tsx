import type {Meta, StoryObj} from '@storybook/react-native';
import {TextButton} from './TextButton';

const meta = {
  title: 'Shared/TextButton',
  component: TextButton,
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Text Button',
    onPress: () => {},
  },
};
