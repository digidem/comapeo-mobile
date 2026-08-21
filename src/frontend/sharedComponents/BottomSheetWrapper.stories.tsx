import type {Meta, StoryObj} from '@storybook/react-native';
import {BottomSheetWrapper} from './BottomSheetWrapper';
import {Text} from 'react-native';
import {withNavigation} from '../../../.rnstorybook/decorators/withNavigation';

const meta = {
  title: 'Shared/BottomSheetWrapper',
  component: BottomSheetWrapper,
  decorators: [withNavigation],
} satisfies Meta<typeof BottomSheetWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {children: null},
  render: () => (
    <BottomSheetWrapper>
      <Text>Bottom Sheet Content</Text>
    </BottomSheetWrapper>
  ),
};
