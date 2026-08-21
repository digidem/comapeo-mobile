import type {Meta, StoryObj} from '@storybook/react-native';
import {PasscodeInput} from './PasscodeInput';
import {useState} from 'react';

const meta = {
  title: 'Shared/PasscodeInput',
  component: PasscodeInput,
} satisfies Meta<typeof PasscodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function StatefulPasscodeInput({
  initialValue,
  error,
  maskValues,
}: {
  initialValue: string;
  error: boolean;
  maskValues?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <PasscodeInput
      inputValue={value}
      onChangeTextWithValidation={setValue}
      error={error}
      maskValues={maskValues}
    />
  );
}

export const Default: Story = {
  args: {
    inputValue: '',
    onChangeTextWithValidation: () => {},
    error: false,
  },
  render: () => <StatefulPasscodeInput initialValue="" error={false} />,
};

export const WithError: Story = {
  args: {
    inputValue: '12',
    onChangeTextWithValidation: () => {},
    error: true,
  },
  render: () => <StatefulPasscodeInput initialValue="12" error />,
};

export const Unmasked: Story = {
  args: {
    inputValue: '12345',
    onChangeTextWithValidation: () => {},
    error: false,
    maskValues: false,
  },
  render: () => (
    <StatefulPasscodeInput
      initialValue="12345"
      error={false}
      maskValues={false}
    />
  ),
};
