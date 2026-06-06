import type {Meta, StoryObj} from '@storybook/react-native';
import {ProjectInfoCard} from './ProjectInfoCard';

const meta = {
  title: 'Shared/ProjectInfoCard',
  component: ProjectInfoCard,
} satisfies Meta<typeof ProjectInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solo: Story = {
  args: {
    headerText: 'My Project',
    role: 'solo',
    backgroundColor: '#E8F0FE',
  },
};

export const Coordinator: Story = {
  args: {
    headerText: 'Team Mapping Project',
    role: 'coordinator',
    projectDescription: 'Mapping the Amazon rainforest',
    backgroundColor: '#E8F5E9',
  },
};

export const Participant: Story = {
  args: {
    headerText: 'Community Survey',
    role: 'participant',
    projectDescription: 'Community land rights documentation',
    backgroundColor: '#FFF3E0',
  },
};
