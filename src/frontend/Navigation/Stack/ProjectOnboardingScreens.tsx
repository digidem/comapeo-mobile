import * as React from 'react';
import {RootStack} from '.';
import {ProjectsIntro} from '../../screens/ProjectOnboarding/ProjectsIntro';
import {JoinProject} from '../../screens/ProjectOnboarding/JoinProject';
import {StartNewProjectScreen} from '../../screens/Settings/ProjectSettings/StartNewProject';
import {CreateProject} from '../../screens/ProjectOnboarding/CreateProject';
import {MessageDescriptor} from 'react-intl';
import {MapOnOwn} from '../../screens/ProjectOnboarding/MapOnOwn';

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
      component={StartNewProjectScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="CreateProject"
      component={CreateProject}
      options={{headerTitle: intl(CreateProject.navTitle)}}
    />
    <RootStack.Screen
      name="MapOnOwn"
      component={MapOnOwn}
      options={{headerShown: false}}
    />
  </RootStack.Group>
);
