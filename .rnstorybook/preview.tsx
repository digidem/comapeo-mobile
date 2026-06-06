import type {Preview} from '@storybook/react-native';
import {minimal} from './decorators/minimal';

const preview: Preview = {
  decorators: [minimal],
  parameters: {},
};

export default preview;
