import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react-native';
import {SelectOne} from './SelectOne';

const meta = {
  title: 'Shared/SelectOne',
  component: SelectOne,
} satisfies Meta<typeof SelectOne<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

function StatefulSelectOne() {
  const [value, setValue] = React.useState('option1');
  return (
    <SelectOne
      value={value}
      onChange={nextValue => {
        setValue(nextValue);
        return nextValue;
      }}
      options={[
        {value: 'option1', label: 'Option 1'},
        {value: 'option2', label: 'Option 2'},
        {value: 'option3', label: 'Option 3'},
      ]}
    />
  );
}

export const Default: Story = {
  args: {
    value: 'option1',
    onChange: () => {},
    options: [
      {value: 'option1', label: 'Option 1'},
      {value: 'option2', label: 'Option 2'},
      {value: 'option3', label: 'Option 3'},
    ],
  },
  render: () => <StatefulSelectOne />,
};
