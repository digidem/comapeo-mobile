import {NavigatorScreenParams} from '@react-navigation/native';
import type {RoleId, RoleIdForNewInvite} from '@mapeo/core/dist/roles';

export type InviteProps = {
  name: string;
  deviceType: DeviceType;
  deviceId: string;
  role: DeviceRoleForNewInvite;
};

export type DeviceType = 'mobile' | 'desktop';

export type DeviceRole = RoleId;

export type DeviceRoleForNewInvite = RoleIdForNewInvite;

export type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
  Tracking: undefined;
  ObservationsList: undefined;
};

export type AppList = {
  Home: NavigatorScreenParams<HomeTabsList>;
  GpsModal: undefined;
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
  ReviewAndInvite: InviteProps;
  InviteAccepted: InviteProps;
  InviteDeclined: InviteProps;
  UnableToCancelInvite: InviteProps;
  DeviceNameDisplay: undefined;
  DeviceNameEdit: undefined;
  SaveTrack: undefined;
  Sync: undefined;
};
