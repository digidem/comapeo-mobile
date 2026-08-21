import type {Meta, StoryObj} from '@storybook/react-native';
import {
  PrimaryButton,
  SecondaryButton,
  DestructiveButton,
  SecondaryDestructiveButton,
} from './Buttons';
import {View} from 'react-native';

const meta = {
  title: 'Shared/Buttons',
  component: PrimaryButton,
  argTypes: {
    onPress: {action: 'pressed'},
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: 'Primary Button',
    fullSize: true,
    onPress: () => {},
  },
};

export const Secondary: Story = {
  render: args => <SecondaryButton {...args} />,
  args: {
    text: 'Secondary Button',
    fullSize: true,
    onPress: () => {},
  },
};

export const Destructive: Story = {
  render: args => <DestructiveButton {...args} />,
  args: {
    text: 'Destructive Button',
    fullSize: true,
    onPress: () => {},
  },
};

export const SecondaryDestructive: Story = {
  render: args => <SecondaryDestructiveButton {...args} />,
  args: {
    text: 'Secondary Destructive',
    fullSize: true,
    onPress: () => {},
  },
};

export const AllVariants: Story = {
  args: {
    text: 'Button variants',
    fullSize: true,
    onPress: () => {},
  },
  render: () => (
    <View style={{gap: 12, padding: 16, alignItems: 'center'}}>
      <PrimaryButton text="Primary" fullSize onPress={() => {}} />
      <SecondaryButton text="Secondary" fullSize onPress={() => {}} />
      <DestructiveButton text="Destructive" fullSize onPress={() => {}} />
      <SecondaryDestructiveButton
        text="Secondary Destructive"
        fullSize
        onPress={() => {}}
      />
    </View>
  ),
};
