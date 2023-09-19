import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import * as React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {DummyScreen} from './DummyScreen';
import HomeHeader from '../../components/HomeHeader';
import {RootStack} from '../AppStack';
import {ScreenWithHeader} from './ScreenWithHeader';
import {MessageDescriptor} from 'react-intl';
import {PhotoView} from '../../screens/PhotoView';
import {CameraScreen} from '../../screens/CameraScreen';
import {ObservationEdit} from '../../screens/ObservationEdit';
import {AddPhotoScreen} from '../../screens/AddPhoto';

export type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
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
  PhotoView: {
    uri: string;
  };
  CategoryChooser: undefined;
  AddPhoto: undefined;
  ObservationList: undefined;
  Observation: {observationId: string};
  ObservationEdit: {observationId?: string};
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
    <Tab.Screen name="Map" component={DummyScreen} />
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
      name="Settings"
      component={ScreenWithHeader}
      options={{headerTitle: intl(ScreenWithHeader.navTitle)}}
    />
    <RootStack.Screen
      name="PhotoView"
      component={PhotoView}
      options={{headerTitle: intl(PhotoView.navTitle)}}
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
  </RootStack.Group>
);
