import * as React from 'react';
import {RootStack} from '.';
import {ProjectsIntro} from '../../screens/ProjectOnboarding/ProjectsIntro';
import {JoinProject} from '../../screens/ProjectOnboarding/JoinProject';
import {StartNewProjectScreen} from '../../screens/Settings/ProjectSettings/StartNewProject';
import {MessageDescriptor} from 'react-intl';
import {MapOnOwn} from '../../screens/ProjectOnboarding/MapOnOwn';
import {CreateProjectScreen} from '../../screens/Settings/CreateOrJoinProject/CreateOrNameSoloProject/CreateProject';

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
      name="OnboardingStartNewProject"
      component={StartNewProjectScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="OnboardingCreateProject"
      component={CreateProjectScreen}
      options={{headerTitle: intl(CreateProjectScreen.navTitle)}}
    />
    <RootStack.Screen
      name="MapOnOwn"
      component={MapOnOwn}
      options={{headerShown: false}}
    />
  </RootStack.Group>
);
