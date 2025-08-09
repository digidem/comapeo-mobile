import * as React from 'react';
import {RootStack} from '.';
import {MessageDescriptor} from 'react-intl';
import {ProjectsIntro} from '../../screens/ProjectOnboarding/ProjectsIntro';

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
  </RootStack.Group>
);
