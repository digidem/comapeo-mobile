import type {Meta, StoryObj} from '@storybook/react-native';
import {PresetView} from './PresetView';
import {Text} from 'react-native';

const meta = {
  title: 'Shared/PresetView',
  component: PresetView,
} satisfies Meta<typeof PresetView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    presetName: 'Tree',
    PresetIcon: <Text style={{fontSize: 24}}>T</Text>,
    onPressPreset: () => {},
  },
};

export const Disabled: Story = {
  args: {
    presetName: 'House',
    PresetIcon: <Text style={{fontSize: 24}}>H</Text>,
    presetDisabled: true,
  },
};
