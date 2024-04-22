import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import * as React from 'react';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {RootStack} from '../AppStack';
import {MessageDescriptor} from 'react-intl';
import {MapScreen} from '../../screens/MapScreen';
import {CameraScreen} from '../../screens/CameraScreen';
import {ObservationEdit} from '../../screens/ObservationEdit';
import {AddPhotoScreen} from '../../screens/AddPhoto';
import {AppPasscode} from '../../screens/AppPasscode';
import {EnterPassToTurnOff} from '../../screens/AppPasscode/EnterPassToTurnOff';
import {SetPasscode} from '../../screens/AppPasscode/SetPasscode';
import {TurnOffPasscode} from '../../screens/AppPasscode/TurnOffPasscode';
import {Security} from '../../screens/Security';
import {AuthScreen} from '../../screens/AuthScreen';
import {ObscurePasscode} from '../../screens/ObscurePasscode';
import {Settings} from '../../screens/Settings';
import {PresetChooser} from '../../screens/PresetChooser';
import {ObservationsList} from '../../screens/ObservationsList';
import {ObservationScreen} from '../../screens/Observation';
import {AppSettings} from '../../screens/Settings/AppSettings';
import {ProjectSettings} from '../../screens/Settings/ProjectSettings';
import {CoordinateFormat} from '../../screens/Settings/AppSettings/CoordinateFormat';
import {CustomHeaderLeftClose} from '../../sharedComponents/CustomHeaderLeftClose';
import {SaveButton} from '../../screens/ObservationEdit/SaveButton';
import {CreateOrJoinProject} from '../../screens/Settings/CreateOrJoinProject';
import {CreateProject} from '../../screens/Settings/CreateOrJoinProject/CreateProject';
import {ProjectCreated} from '../../screens/Settings/CreateOrJoinProject/CreateProject/ProjectCreated';
import {JoinExistingProject} from '../../screens/Settings/CreateOrJoinProject/JoinExistingProject';
import {YourTeam} from '../../screens/Settings/ProjectSettings/YourTeam';
import {SelectDevice} from '../../screens/Settings/ProjectSettings/YourTeam/SelectDevice';
import {DeviceRole, DeviceType} from '../../sharedTypes';
import {SelectInviteeRole} from '../../screens/Settings/ProjectSettings/YourTeam/SelectInviteeRole';
import {ReviewInvitation} from '../../screens/Settings/ProjectSettings/YourTeam/ReviewAndInvite/ReviewInvitation';
import {InviteAccepted} from '../../screens/Settings/ProjectSettings/YourTeam/InviteAccepted';
import {ReviewAndInvite} from '../../screens/Settings/ProjectSettings/YourTeam/ReviewAndInvite';
import {
  DisplayScreen as DeviceNameDisplayScreen,
  createNavigationOptions as createDeviceNameDisplayNavOptions,
} from '../../screens/Settings/ProjectSettings/DeviceName/DisplayScreen';
import {
  EditScreen as DeviceNameEditScreen,
  createNavigationOptions as createDeviceNameEditNavOptions,
} from '../../screens/Settings/ProjectSettings/DeviceName/EditScreen';
import {
  GpsModal,
  createNavigationOptions as createGpsModalNavigationOptions,
} from '../../screens/GpsModal';
import {useCurrentTab} from '../../hooks/useCurrentTab';
import {TrackingTabBarIcon} from './TabBar/TrackingTabBarIcon';
import {TabName} from '../types';
import {CameraTabBarIcon} from './TabBar/CameraTabBarIcon';
import {MapTabBarIcon} from './TabBar/MapTabBarIcon';

export const TAB_BAR_HEIGHT = 70;

export type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
  Tracking: undefined;
};

export type AppList = {
  Home: NavigatorScreenParams<HomeTabsList>;
  GpsModal: undefined;
  SyncModal: undefined;
  Settings: undefined;
  ProjectConfig: undefined;
  AboutMapeo: undefined;
  LanguageSettings: undefined;
  CoordinateFormat: undefined;
  Experiments: undefined;
  PhotosModal: {
    photoIndex: number;
    observationId?: string;
    editing: boolean;
  };
  PhotoView: undefined;
  PresetChooser: undefined;
  AddPhoto: undefined;
  ObservationList: undefined;
  Observation: {observationId: string};
  ObservationEdit: {observationId?: string} | undefined;
  ManualGpsScreen: undefined;
  ObservationDetails: {question: number};
  LeaveProjectScreen: undefined;
  AlreadyOnProj: undefined;
  AddToProjectScreen: undefined;
  UnableToLinkScreen: undefined;
  ConnectingToDeviceScreen: {task: () => Promise<void>};
  ConfirmLeavePracticeModeScreen: {projectAction: 'join' | 'create'};
  CreateProject: undefined;
  Security: undefined;
  DirectionalArrow: undefined;
  P2pUpgrade: undefined;
  MapSettings: undefined;
  BackgroundMaps: undefined;
  BackgroundMapInfo: {
    bytesStored: number;
    id: string;
    styleUrl: string;
    name: string;
  };
  BGMapsSettings: undefined;
  AuthScreen: undefined;
  AppPasscode: undefined;
  ObscurePasscode: undefined;
  ConfirmPasscodeSheet: {passcode: string};
  DisablePasscode: undefined;
  SetPasscode: undefined;
  EnterPassToTurnOff: undefined;
  AppSettings: undefined;
  ProjectSettings: undefined;
  CreateOrJoinProject: undefined;
  ProjectCreated: {name: string};
  JoinExistingProject: undefined;
  YourTeam: undefined;
  SelectDevice: undefined;
  SelectInviteeRole: {name: string; deviceType: DeviceType; deviceId: string};
  ReviewAndInvite: {
    name: string;
    deviceType: DeviceType;
    deviceId: string;
    role: DeviceRole;
  };
  InviteAccepted: {
    name: string;
    deviceType: DeviceType;
    deviceId: string;
    role: DeviceRole;
  };
  DeviceNameDisplay: undefined;
  DeviceNameEdit: undefined;
};

const Tab = createBottomTabNavigator<HomeTabsList>();

const HomeTabs = () => {
  const {handleTabPress} = useCurrentTab();

  return (
    <Tab.Navigator
      screenListeners={{tabPress: handleTabPress}}
      screenOptions={({route}) => ({
        tabBarStyle: {height: TAB_BAR_HEIGHT},
        tabBarShowLabel: false,
        headerTransparent: true,
        tabBarTestID: 'tabBarButton' + route.name,
        header: HomeHeader,
      })}
      initialRouteName={TabName.Map}
      backBehavior="initialRoute">
      <Tab.Screen
        name={TabName.Map}
        component={MapScreen}
        options={{
          tabBarIcon: MapTabBarIcon,
        }}
      />
      <Tab.Screen
        name={TabName.Camera}
        component={CameraScreen}
        options={{
          tabBarIcon: CameraTabBarIcon,
        }}
      />
      <Tab.Screen
        name={TabName.Tracking}
        options={{
          tabBarIcon: TrackingTabBarIcon,
          headerShown: false,
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(TabName.Map);
          },
        })}
        children={() => <></>}
      />
    </Tab.Navigator>
  );
};

// **NOTE**: No hooks allowed here (this is not a component, it is a function
// that returns a react element)
export const createDefaultScreenGroup = (
  intl: (title: MessageDescriptor) => string,
) => (
  <RootStack.Group key="default">
    <RootStack.Screen
      name="Home"
      options={{headerShown: false}}
      component={HomeTabs}
    />
    <RootStack.Screen
      name="AuthScreen"
      component={AuthScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="ObservationEdit"
      component={ObservationEdit}
      options={props => {
        const observationId = props.route.params?.observationId;
        return {
          headerLeft: params => (
            <CustomHeaderLeftClose
              headerBackButtonProps={params}
              observationId={observationId}
            />
          ),
          headerRight: () => <SaveButton observationId={observationId} />,
          headerTitle: observationId
            ? intl(ObservationEdit.editTitle)
            : intl(ObservationEdit.navTitle),
        };
      }}
    />
    <RootStack.Screen
      name="AddPhoto"
      component={AddPhotoScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="Security"
      component={Security}
      options={{headerTitle: intl(Security.navTitle)}}
    />
    <RootStack.Screen
      name="AppPasscode"
      component={AppPasscode}
      options={{headerTitle: intl(AppPasscode.navTitle)}}
    />
    <RootStack.Screen
      name="DisablePasscode"
      component={TurnOffPasscode}
      options={{headerTitle: intl(TurnOffPasscode.navTitle)}}
    />
    <RootStack.Screen
      name="SetPasscode"
      component={SetPasscode}
      options={{headerTitle: intl(SetPasscode.navTitle)}}
    />
    <RootStack.Screen
      name="EnterPassToTurnOff"
      component={EnterPassToTurnOff}
      options={{headerTitle: intl(EnterPassToTurnOff.navTitle)}}
    />
    <RootStack.Screen
      name="ObscurePasscode"
      component={ObscurePasscode}
      options={{headerTitle: intl(ObscurePasscode.navTitle)}}
    />
    <RootStack.Screen name="Settings" component={Settings} />
    <RootStack.Screen
      name="PresetChooser"
      component={PresetChooser}
      options={{headerTitle: intl(PresetChooser.navTitle)}}
    />
    <RootStack.Screen
      name="ObservationList"
      component={ObservationsList}
      options={{headerTitle: intl(ObservationsList.navTitle)}}
    />
    <RootStack.Screen
      name="Observation"
      component={ObservationScreen}
      options={{headerTitle: intl(ObservationScreen.navTitle)}}
    />
    <RootStack.Screen
      name="AppSettings"
      component={AppSettings}
      options={{headerTitle: intl(AppSettings.navTitle)}}
    />
    <RootStack.Screen
      name="ProjectSettings"
      component={ProjectSettings}
      options={{headerTitle: intl(ProjectSettings.navTitle)}}
    />
    <RootStack.Screen
      name="CoordinateFormat"
      component={CoordinateFormat}
      options={{headerTitle: intl(CoordinateFormat.navTitle)}}
    />
    <RootStack.Screen
      name="CreateOrJoinProject"
      component={CreateOrJoinProject}
      options={{headerTitle: intl(CreateOrJoinProject.navTitle)}}
    />
    <RootStack.Screen
      name="CreateProject"
      component={CreateProject}
      options={{headerTitle: intl(CreateProject.navTitle)}}
    />
    <RootStack.Screen
      name="ProjectCreated"
      component={ProjectCreated}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="JoinExistingProject"
      component={JoinExistingProject}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="YourTeam"
      component={YourTeam}
      options={{headerTitle: intl(YourTeam.navTitle)}}
    />
    <RootStack.Screen
      name="SelectDevice"
      component={SelectDevice}
      options={{headerTitle: intl(SelectDevice.navTitle)}}
    />
    <RootStack.Screen
      name="SelectInviteeRole"
      component={SelectInviteeRole}
      options={{headerTitle: intl(SelectInviteeRole.navTitle)}}
    />
    <RootStack.Screen
      name="ReviewAndInvite"
      component={ReviewAndInvite}
      options={{headerTitle: intl(ReviewInvitation.navTitle)}}
    />
    <RootStack.Screen
      name="InviteAccepted"
      component={InviteAccepted}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DeviceNameDisplay"
      component={DeviceNameDisplayScreen}
      options={createDeviceNameDisplayNavOptions({intl})}
    />
    <RootStack.Screen
      name="DeviceNameEdit"
      component={DeviceNameEditScreen}
      options={createDeviceNameEditNavOptions({intl})}
    />
    <RootStack.Screen
      name="GpsModal"
      component={GpsModal}
      options={createGpsModalNavigationOptions({intl})}
    />
  </RootStack.Group>
);
