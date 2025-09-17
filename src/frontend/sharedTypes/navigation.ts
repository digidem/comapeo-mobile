import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MessageDescriptor} from 'react-intl';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {DeviceRoleForNewInvite, DeviceType} from '.';
import {
  ProcessedDraftPhoto,
  SavedPhoto,
} from '../contexts/PhotoPromiseContext/types';
import {Audio} from 'expo-av';
import {Exports} from '../screens/ExportObservations';

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
  Map: undefined | {trackingOpen: boolean};
  Camera: undefined;
  ObservationsList: undefined;
};

export type TabName = keyof HomeTabsParamsList;

export type RootStackParamsList = {
  Home: NavigatorScreenParams<HomeTabsParamsList>;
  GpsModal: undefined;
  Settings: undefined;
  Config: undefined;
  AboutSettings: undefined;
  LanguageSettings: undefined;
  CoordinateFormat: undefined;
  Experiments: undefined;
  DraftPhotoPreviewModal: {
    photo: ProcessedDraftPhoto;
  };
  AttachedPhotoPreviewModal: {
    photo: SavedPhoto;
    observationDocId: string;
  };
  ConfirmDeletePhoto: {
    onSuccess?: () => void;
    // We currently only support deleting processed draft photos
    // but we will eventually support deleting saved photos as well.
    photo: ProcessedDraftPhoto;
  };
  TrackCategoryChooser: undefined;
  ObservationCategoryChooser: undefined;
  AddPhoto: undefined;
  Observation: {observationId: string};
  ObservationEdit: {observationId: string};
  ManualGpsScreen: undefined;
  ObservationDetails: {question: number};
  AddToProjectScreen: undefined;
  UnableToLinkScreen: undefined;
  ConnectingToDeviceScreen: {task: () => Promise<void>};
  ConfirmLeavePracticeModeScreen: {projectAction: 'join' | 'create'};
  CreateProject: undefined;
  NameSoloProject: undefined;
  Security: undefined;
  DirectionalArrow: undefined;
  P2pUpgrade: undefined;
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
  ProjectCreatedNewProject: {name: string};
  ProjectCreatedNewSolo: {name: string};
  JoinExistingProject: undefined;
  YourTeam: undefined;
  SelectDevice: undefined;
  SelectInviteeRole: {name: string; deviceType: DeviceType; deviceId: string};
  ReviewAndInvite: InviteProps;
  InviteAccepted: {name: string};
  InviteDeclined: InviteProps;
  UnableToCancelInvite: InviteProps;
  DeviceNameDisplay: undefined;
  DeviceNameEdit: undefined;
  SaveTrack: undefined;
  Sync: undefined;
  Track: {trackId: string};
  TrackEdit: {trackId: string};
  CreateTestData: undefined;
  MediaSyncSettings: undefined;
  DataAndPrivacy: undefined;
  SettingsPrivacyPolicy: undefined;
  SuccessfullyAddedArchive: {archiveName: string; url: string};
  MapManagement: undefined;
  BackgroundMaps: undefined;
  SyncPreviewsBottomSheet: undefined;
  SyncEverythingBottomSheet: undefined;
  ExchangeSettingsBottomSheet: undefined;
  AudioAskPermissionBottomSheet: {
    audioPermission: Audio.PermissionResponse;
  };
  AudioRecording: undefined;
  AudioDraftPlaybackScreen: {
    uri: string;
    createdAt: number;
    showRecordingSavedText: boolean;
  };
  AudioAttachmentPlaybackScreen: {
    driveDiscoveryId: string;
    name: string;
    type: 'audio';
    createdAt: string;
  };
  InviteReceived: {inviteId: string};
  InviteSuccessfullyAccepted: {projectName: string};
  InviteCanceled: {projectName: string};
  ObservationMetadata: {observationId: string};
  ErrorBottomSheet: undefined;
  BackgroundMapErrorBottomSheet: {title: string; description: string};
  Menu: undefined;
  AllProjects: undefined;
  InviteCollaborators: undefined;
  StartNewProject: undefined;
  EditProjectDetails: undefined;
  TrackRecordingActive: undefined;
  RemoteArchive: undefined;
  AddRemoteArchive: undefined;
  RemoveRemoteArchive: {
    baseUrl: string;
    name?: string;
    serverDeviceId: string;
  };
  ExportObservations: undefined;
  DidNotMoveBottomSheet: undefined;
  ShareProjectStats: {projectType: 'solo' | 'newProject'; projectName: string};
  ExportSuccess: {exportType: Exports};
};

export type OnboardingParamsList = {
  IntroToCoMapeo: undefined;
  DataPrivacy: undefined;
  DeviceNaming: undefined;
  OnboardingPrivacyPolicy: undefined;
  Success: {deviceName: string};
};

export type ProjectOnboardingParamsList = {
  ProjectsIntro: undefined;
  JoinProject: undefined;
  OnboardingStartNewProject: undefined;
  OnboardingCreateProject: undefined;
  MapOnOwn: undefined;
  ProjectCreatedOnboarding: {projectId: string; name: string};
};

export type AppStackParamsList = RootStackParamsList &
  OnboardingParamsList &
  ProjectOnboardingParamsList;

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
