import * as React from 'react';
import {RootStack} from '.';
import {ProjectsIntro} from '../../screens/ProjectOnboarding/ProjectsIntro';
import {JoinProject} from '../../screens/ProjectOnboarding/JoinProject';
import {StartNewProject} from '../../screens/ProjectOnboarding/StartNewProject';

export const createProjectOnboardingScreens = () => (
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
  </RootStack.Group>
);
