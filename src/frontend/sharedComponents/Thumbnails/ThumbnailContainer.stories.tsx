import type {Meta, StoryObj} from '@storybook/react-native';
import {ThumbnailContainer, ThumbnailLoader} from './ThumbnailContainer';
import {Text} from 'react-native';

const meta = {
  title: 'Shared/ThumbnailContainer',
  component: ThumbnailContainer,
} satisfies Meta<typeof ThumbnailContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 100,
    onPress: () => {},
    children: <Text>Content</Text>,
  },
};

export const Loading: Story = {
  args: {} as any,
  render: () => <ThumbnailLoader size={100} />,
};
