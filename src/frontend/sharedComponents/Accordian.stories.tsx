import type {Meta, StoryObj} from '@storybook/react-native';
import {Accordian} from './Accordian';
import {Text} from 'react-native';

const meta = {
  title: 'Shared/Accordian',
  component: Accordian,
} satisfies Meta<typeof Accordian>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: <Text style={{fontSize: 16}}>Expandable Section</Text>,
    innerAccordianDetails: (
      <Text style={{padding: 16}}>
        This is the expanded content of the accordion.
      </Text>
    ),
  },
};
