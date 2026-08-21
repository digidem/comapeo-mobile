import type {Meta, StoryObj} from '@storybook/react-native';
import {ScreenContentWithDock} from './ScreenContentWithDock';
import {PrimaryButton} from './Buttons';
import {Text, View} from 'react-native';

const meta = {
  title: 'Shared/ScreenContentWithDock',
  component: ScreenContentWithDock,
} satisfies Meta<typeof ScreenContentWithDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
    dockContent: null,
  },
  render: () => (
    <ScreenContentWithDock
      dockContent={<PrimaryButton text="Save" fullSize onPress={() => {}} />}>
      <View style={{gap: 16}}>
        <Text>Scrollable content area</Text>
        <Text>More content here</Text>
        <Text>And even more content</Text>
      </View>
    </ScreenContentWithDock>
  ),
};
