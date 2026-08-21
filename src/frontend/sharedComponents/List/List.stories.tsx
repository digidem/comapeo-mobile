import type {Meta, StoryObj} from '@storybook/react-native';
import {List} from './List';
import {ListItem, ListDivider} from './ListItem';
import {ListItemText} from './ListItemText';
import {ListItemIcon} from './ListItemIcon';

const meta = {
  title: 'Shared/List',
  component: List,
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleList: Story = {
  args: {children: null},
  render: () => (
    <List>
      <ListItem onPress={() => {}}>
        <ListItemIcon iconName="settings" />
        <ListItemText primary="Settings" />
      </ListItem>
      <ListDivider />
      <ListItem onPress={() => {}}>
        <ListItemIcon iconName="info" />
        <ListItemText primary="About" secondary="Version 1.0.0" />
      </ListItem>
      <ListDivider />
      <ListItem onPress={() => {}}>
        <ListItemIcon iconName="help" />
        <ListItemText primary="Help" />
      </ListItem>
    </List>
  ),
};

export const WithSubheader: Story = {
  args: {children: null},
  render: () => (
    <List subheader="General">
      <ListItem onPress={() => {}}>
        <ListItemText primary="Language" secondary="English" />
      </ListItem>
      <ListItem onPress={() => {}}>
        <ListItemText primary="Coordinate Format" secondary="Decimal Degrees" />
      </ListItem>
    </List>
  ),
};
