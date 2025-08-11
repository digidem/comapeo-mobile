import * as React from 'react';
import {RootStack} from '.';
import {ProjectsIntro} from '../../screens/ProjectOnboarding/ProjectsIntro';

export const createProjectOnboardingScreens = () => (
  <RootStack.Group key="project-onboarding">
    <RootStack.Screen
      name="ProjectsIntro"
      component={ProjectsIntro}
      options={{headerShown: false}}
    />
  </RootStack.Group>
);
