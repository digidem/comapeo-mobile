import type {Meta, StoryObj} from '@storybook/react-native';
import {PasscodeInput} from './PasscodeInput';
import {useState} from 'react';

const meta = {
  title: 'Shared/PasscodeInput',
  component: PasscodeInput,
} satisfies Meta<typeof PasscodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('');
    return (
      <PasscodeInput
        inputValue={value}
        onChangeTextWithValidation={setValue}
        error={false}
      />
    );
  },
};

export const WithError: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('12');
    return (
      <PasscodeInput
        inputValue={value}
        onChangeTextWithValidation={setValue}
        error={true}
      />
    );
  },
};

export const Unmasked: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('12345');
    return (
      <PasscodeInput
        inputValue={value}
        onChangeTextWithValidation={setValue}
        error={false}
        maskValues={false}
      />
    );
  },
};
