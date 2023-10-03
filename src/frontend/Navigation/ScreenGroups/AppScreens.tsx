import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import * as React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
import {EmptySettingsScreen} from '../../screens/Settings/EmptySettingsScreen';
import {CategoryChooser} from '../../screens/CategoryChooser';
import {ObservationsList} from '../../screens/ObservationsList';

export type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
};

export type AppList = {
  Home: NavigatorScreenParams<HomeTabsList>;
  GpsModal: undefined;
  SyncModal: undefined;
  Settings: undefined;
  Empty: undefined;
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
  CategoryChooser: undefined;
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
  CreateProjectScreen: undefined;
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
};

const Tab = createBottomTabNavigator<HomeTabsList>();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({color}) => {
        const iconName = route.name === 'Map' ? 'map' : 'photo-camera';
        return <MaterialIcons name={iconName} size={30} color={color} />;
      },
      header: () => <HomeHeader />,
      headerTransparent: true,
      tabBarTestID: 'tabBarButton' + route.name,
    })}
    initialRouteName="Map"
    backBehavior="initialRoute">
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
  </Tab.Navigator>
);

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
      options={{headerTitle: intl(ObservationEdit.navTitle)}}
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
      name="Empty"
      component={EmptySettingsScreen}
      options={{headerTitle: 'Empty screen'}}
    />
    <RootStack.Screen
      name="CategoryChooser"
      component={CategoryChooser}
      options={{headerTitle: intl(CategoryChooser.navTitle)}}
    />
    <RootStack.Screen
      name="ObservationList"
      component={ObservationsList}
      options={{headerTitle: intl(ObservationsList.navTitle)}}
    />
  </RootStack.Group>
);
