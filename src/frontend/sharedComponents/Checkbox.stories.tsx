import type {Meta, StoryObj} from '@storybook/react-native';
import {Checkbox} from './Checkbox';
import {View} from 'react-native';

const meta = {
  title: 'Shared/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    value: false,
    onPress: () => {},
    hitSlop: {top: 10, bottom: 10, left: 10, right: 10},
  },
};

export const Checked: Story = {
  args: {
    value: true,
    onPress: () => {},
    hitSlop: {top: 10, bottom: 10, left: 10, right: 10},
  },
};

export const Error: Story = {
  args: {
    value: false,
    onPress: () => {},
    error: true,
    hitSlop: {top: 10, bottom: 10, left: 10, right: 10},
  },
};

export const AllStates: Story = {
  args: {
    value: false,
    onPress: () => {},
    hitSlop: {top: 10, bottom: 10, left: 10, right: 10},
  },
  render: () => (
    <View style={{flexDirection: 'row', gap: 20, padding: 16}}>
      <Checkbox
        value={false}
        onPress={() => {}}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      />
      <Checkbox
        value={true}
        onPress={() => {}}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      />
      <Checkbox
        value={false}
        onPress={() => {}}
        error
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      />
    </View>
  ),
};
