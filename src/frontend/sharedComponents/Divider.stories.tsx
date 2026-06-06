import type {Meta, StoryObj} from '@storybook/react-native';
import {Divider} from './Divider';
import {View} from 'react-native';

const meta = {
  title: 'Shared/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <View style={{padding: 16}}>
      <Divider />
    </View>
  ),
};
