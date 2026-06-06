import type {Meta, StoryObj} from '@storybook/react-native';
import {MetricsDiagnosticsPermissionToggle} from './MetricsDiagnosticsPermissionToggle';

const meta = {
  title: 'Shared/MetricsDiagnosticsPermissionToggle',
  component: MetricsDiagnosticsPermissionToggle,
} satisfies Meta<typeof MetricsDiagnosticsPermissionToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
