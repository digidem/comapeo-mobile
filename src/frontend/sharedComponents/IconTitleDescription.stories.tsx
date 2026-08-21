import type {Meta, StoryObj} from '@storybook/react-native';
import {IconTitleDescription} from './IconTitleDescription';
import {Text} from 'react-native';

const meta = {
  title: 'Shared/IconTitleDescription',
  component: IconTitleDescription,
} satisfies Meta<typeof IconTitleDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Text style={{fontSize: 48}}>OK</Text>,
    title: 'Success!',
    description: 'Your action was completed successfully.',
  },
};

export const WithoutDescription: Story = {
  args: {
    icon: <Text style={{fontSize: 48}}>OK</Text>,
    title: 'Title Only',
  },
};
