import type {Meta, StoryObj} from '@storybook/react-native';
import {Loading} from './Loading';

const meta = {
  title: 'Shared/Loading',
  component: Loading,
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
