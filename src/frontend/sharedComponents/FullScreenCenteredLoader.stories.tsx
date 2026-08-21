import type {Meta, StoryObj} from '@storybook/react-native';
import {FullScreenCenteredLoader} from './FullScreenCenteredLoader';

const meta = {
  title: 'Shared/Loading',
  component: FullScreenCenteredLoader,
} satisfies Meta<typeof FullScreenCenteredLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
