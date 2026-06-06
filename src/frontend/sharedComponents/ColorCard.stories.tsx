import type {Meta, StoryObj} from '@storybook/react-native';
import {ColorCard} from './ColorCard';
import {Text} from 'react-native';

const meta = {
  title: 'Shared/ColorCard',
  component: ColorCard,
} satisfies Meta<typeof ColorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    backgroundColor: '#E8F0FE',
    children: <Text>Card Content</Text>,
  },
};

export const WithBorder: Story = {
  args: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
    children: <Text>Card with Border</Text>,
  },
};

export const Pressable: Story = {
  args: {
    backgroundColor: '#E8F5E9',
    children: <Text>Pressable Card</Text>,
    onPress: () => {},
  },
};
