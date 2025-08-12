import * as React from 'react';
import {RootStack} from '.';
import {ProjectsIntro} from '../../screens/ProjectOnboarding/ProjectsIntro';
import {JoinProject} from '../../screens/ProjectOnboarding/JoinProject';
import {StartNewProject} from '../../screens/ProjectOnboarding/StartNewProject';
import {CreateProject} from '../../screens/ProjectOnboarding/CreateProject';
import {MessageDescriptor} from 'react-intl';

export const createProjectOnboardingScreens = ({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) => (
  <RootStack.Group key="project-onboarding">
    <RootStack.Screen
      name="ProjectsIntro"
      component={ProjectsIntro}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="JoinProject"
      component={JoinProject}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="StartNewProject"
      component={StartNewProject}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="CreateProject"
      component={CreateProject}
      options={{headerTitle: intl(CreateProject.navTitle)}}
    />
  </RootStack.Group>
);
