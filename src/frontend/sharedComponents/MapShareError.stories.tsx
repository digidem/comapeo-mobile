import type {Meta, StoryObj} from '@storybook/react-native';
import {MapShareError} from './MapShareError';

const meta = {
  title: 'Shared/MapShareError',
  component: MapShareError,
} satisfies Meta<typeof MapShareError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Transfer Failed',
    description: 'The map transfer could not be completed.',
    onClose: () => {},
  },
};
