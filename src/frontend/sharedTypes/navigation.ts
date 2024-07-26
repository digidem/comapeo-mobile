import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MessageDescriptor} from 'react-intl';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {DeviceRoleForNewInvite, DeviceType} from '.';

export interface TabBarIconProps {
  size: number;
  focused: boolean;
  color: string;
}

export type InviteProps = {
  name: string;
  deviceType: DeviceType;
  deviceId: string;
  role: DeviceRoleForNewInvite;
};

export type HomeTabsParamsList = {
  Map: undefined;
  Camera: undefined;
  Tracking: undefined;
  ObservationsList: undefined;
};

export type TabName = keyof HomeTabsParamsList;

export type RootStackParamsList = {
  Home: NavigatorScreenParams<HomeTabsParamsList>;
  GpsModal: undefined;
  Settings: undefined;
  ProjectConfig: undefined;
  AboutSettings: undefined;
  LanguageSettings: undefined;
  CoordinateFormat: undefined;
  Experiments: undefined;
  PhotoPreviewModal: {
    attachmentId?: string;
    observationId?: string;
    originalPhotoUri?: string;
    deletable?: boolean;
  };
  PresetChooser: undefined;
  AddPhoto: undefined;
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
  ObservationFields: {question: number};
  ObservationCreate: undefined;
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
  ReviewAndInvite: InviteProps;
  InviteAccepted: InviteProps;
  InviteDeclined: InviteProps;
  UnableToCancelInvite: InviteProps;
  DeviceNameDisplay: undefined;
  DeviceNameEdit: undefined;
  SaveTrack: undefined;
  Sync: undefined;
};

export type DeviceNamingParamsList = {
  IntroToCoMapeo: undefined;
  DeviceNaming: undefined;
  Success: {deviceName: string};
};

export type AppStackParamsList = RootStackParamsList & DeviceNamingParamsList;

export type NativeRootNavigationProps<
  ScreenName extends keyof AppStackParamsList,
> = NativeStackScreenProps<AppStackParamsList, ScreenName>;

export type NativeNavigationComponent<
  ScreenName extends keyof AppStackParamsList,
> = React.FC<NativeRootNavigationProps<ScreenName>> & {
  navTitle: MessageDescriptor;
};

export type NativeHomeTabsNavigationProps<
  ScreenName extends keyof HomeTabsParamsList,
> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsParamsList, ScreenName>,
  NativeStackScreenProps<AppStackParamsList>
>;
