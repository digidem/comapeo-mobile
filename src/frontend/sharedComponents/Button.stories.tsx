import type {Meta, StoryObj} from '@storybook/react-native';
import {Button} from './Button';
import {View} from 'react-native';

const meta = {
  title: 'Shared/Button (Legacy)',
  component: Button,
  argTypes: {
    onPress: {action: 'pressed'},
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contained: Story = {
  args: {
    children: 'Contained Button',
    variant: 'contained',
    color: 'dark',
    onPress: () => {},
  },
};

export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    variant: 'outlined',
    color: 'dark',
    onPress: () => {},
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'contained',
    color: 'dark',
    disabled: true,
    onPress: () => {},
  },
};

export const AllVariants: Story = {
  args: {
    children: 'Button variants',
    onPress: () => {},
  },
  render: () => (
    <View style={{gap: 12, padding: 16, alignItems: 'center'}}>
      <Button variant="contained" color="dark" onPress={() => {}}>
        Contained Dark
      </Button>
      <Button variant="contained" color="ComapeoBlue" onPress={() => {}}>
        Contained Blue
      </Button>
      <Button variant="outlined" color="dark" onPress={() => {}}>
        Outlined Dark
      </Button>
      <Button variant="outlined" color="ComapeoBlue" onPress={() => {}}>
        Outlined Blue
      </Button>
      <Button variant="contained" color="dark" disabled onPress={() => {}}>
        Disabled
      </Button>
    </View>
  ),
};
