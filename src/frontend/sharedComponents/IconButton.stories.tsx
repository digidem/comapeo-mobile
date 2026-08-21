import type {Meta, StoryObj} from '@storybook/react-native';
import {IconButton} from './IconButton';
import {Text} from 'react-native';

const meta = {
  title: 'Shared/IconButton',
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onPress: () => {},
    children: <Text style={{fontSize: 24}}>X</Text>,
  },
};
