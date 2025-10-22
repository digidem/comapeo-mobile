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

// --- Early Access routing pattern -----------------------------------------
// Require { isEarlyAdopter: true } (literal true, not boolean) for any *early-access-only* screen.
//
// Example usage when you add the first early-only screen:
//
// type RootStackParamList = {
//   ProjectInviteDefault: { projectId: string };
//   // Early-access-only route (uncomment when needed):
//   // ProjectInviteQRCodeEarly: { projectId: string } & EarlyOnlyParam;
// };
//
// When the feature is fully adopted to the app, remove EarlyOnlyParam from the route to let TS
// surface all call sites for cleanup.
// ---------------------------------------------------------------------------

export type EarlyOnlyParam = {readonly isEarlyAdopter: true};

export type RootStackParamsList = {
  Home: NavigatorScreenParams<HomeTabsParamsList>;
  GpsModal: undefined;
  Settings: undefined;
  Config: undefined;
  AboutSettings: undefined;
  LanguageSettings: undefined;
  CoordinateFormat: undefined;
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
  CreateProject: undefined;
  NameSoloProject: undefined;
  Security: undefined;
  ObservationFields: {question: number};
  ObservationCreate: undefined;
  AuthScreen: undefined;
  AppPasscode: undefined;
  ObscurePasscode: undefined;
  ConfirmPasscodeSheet: {passcode: string};
  DisablePasscode: undefined;
  SetPasscode: undefined;
  EnterPassToTurnOff: undefined;
  AppSettings: undefined;
  ProjectSettings: undefined;
  Collaborate: undefined;
  JoinAProject: undefined;
  StartNewProjectIntro: undefined;
  NameDefaultProjectIntro: undefined;
  ProjectCreated: {
    name: string;
    statsShared: boolean;
  };
  YourTeam: {projectName: string};
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
  DataAndPrivacy: undefined;
  SettingsPrivacyPolicy: undefined;
  SuccessfullyAddedArchive: {archiveName: string; url: string};
  BackgroundMaps: undefined;
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
  ShareProjectStats: {projectName: string};
  AppUsagePromptInterstitial: undefined;
  AppUsageSharingSuccess: undefined;
  ExportSuccess: {exportType: Exports};
  ProjectStatistics: undefined;
  ProjectStatsTurnedOff: undefined;
  EarlyAccess: undefined;
  EarlyAccessOff: undefined;
  CollaboratorInfo: {
    deviceId: string;
    isOwnDevice: boolean;
    deviceType: DeviceType;
  };
};

export type OnboardingParamsList = {
  IntroToCoMapeo: undefined;
  DataPrivacy: undefined;
  DeviceNaming: undefined;
  OnboardingPrivacyPolicy: undefined;
  Success: undefined;
  JoinProjectIntro: undefined;
  MapOnYourOwnIntro: undefined;
  ErrorBottomSheet: undefined;
};

export type AppStackParamsList = RootStackParamsList & OnboardingParamsList;

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
