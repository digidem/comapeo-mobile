import * as React from 'react';
import {createIntl} from 'react-intl';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  ObservationEdit,
  createNavigationOptions as createObservationEditNavOptions,
} from '../../screens/ObservationEdit';
import {AddPhotoScreen} from '../../screens/AddPhoto';
import {AppPasscode} from '../../screens/ComapeoSettings/Security/AppPasscode';
import {EnterPassToTurnOff} from '../../screens/ComapeoSettings/Security/AppPasscode/EnterPassToTurnOff';
import {SetPasscode} from '../../screens/ComapeoSettings/Security/AppPasscode/SetPasscode';
import {TurnOffPasscode} from '../../screens/ComapeoSettings/Security/AppPasscode/TurnOffPasscode';
import {TurnOffPasscodeBottomSheet} from '../../screens/ComapeoSettings/Security/AppPasscode/TurnOffPasscodeBottomSheet';
import {Security} from '../../screens/ComapeoSettings/Security';
import {ObscurePasscode} from '../../screens/ComapeoSettings/Security/ObscurePasscode';
import {ObservationCategoryChooser} from '../../screens/PresetChooser/ObservationCategoryChooser.tsx';
import {TrackCategoryChooser} from '../../screens/PresetChooser/TrackCategoryChooser.tsx';
import {ObservationScreen} from '../../screens/Observation';
import {AppSettings} from '../../screens/ComapeoSettings/index.tsx';
import {ProjectSettings} from '../../screens/ProjectSettings';
import {CoordinateFormat} from '../../screens/ComapeoSettings/CoordinateFormat.tsx';
import {
  CreateOrNameSoloProject,
  createNavigationOptions as createNameProjectNavOptions,
} from '../../screens/ProjectCreation/CreateOrNameSoloProject';
import {ProjectCreated} from '../../screens/ProjectCreation/CreateOrNameSoloProject/ProjectCreated';
import {YourTeam} from '../../screens/YourTeam';
import {SelectInviteDevice} from '../../screens/YourTeam/SelectInviteDevice';
import {SelectMapShareDevice} from '../../screens/BackgroundMaps/SelectMapShareDevice';
import {SelectInviteeRole} from '../../screens/YourTeam/SelectInviteeRole';
import {ReviewInvitation} from '../../screens/YourTeam/ReviewAndInvite/ReviewInvitation';
import {InviteAccepted} from '../../screens/YourTeam/InviteAccepted';
import {ReviewAndInvite} from '../../screens/YourTeam/ReviewAndInvite';
import {RemoveDevice} from '../../screens/YourTeam/RemoveDevice';
import {DeviceRemovedSuccess} from '../../screens/YourTeam/DeviceRemovedSuccess';
import {
  DisplayScreen as DeviceNameDisplayScreen,
  createNavigationOptions as createDeviceNameDisplayNavOptions,
} from '../../screens/ComapeoSettings/DeviceName/DisplayScreen';
import {
  EditScreen as DeviceNameEditScreen,
  createNavigationOptions as createDeviceNameEditNavOptions,
} from '../../screens/ComapeoSettings/DeviceName/EditScreen';
import {
  LocationInfoScreen,
  createNavigationOptions as createLocationInfoNavOptions,
} from '../../screens/LocationInfoScreen';
import {InviteDeclined} from '../../screens/YourTeam/InviteDeclined';
import {UnableToCancelInvite} from '../../screens/YourTeam/ReviewAndInvite/UnableToCancelInvite';
import {SyncScreen} from '../../screens/Exchange/index.tsx';
import {
  ManualGpsScreen,
  createNavigationOptions as createManualGpsNavigationOptions,
} from '../../screens/ManualGpsScreen';
import {HomeTabs} from '../Tab';
import {SaveTrackScreen} from '../../screens/SaveTrack/SaveTrackScreen';
import {ObservationFields} from '../../screens/ObservationFields';
import {LanguageSettings} from '../../screens/ComapeoSettings/LanguageSettings.tsx';
import {UnitSystemSettings} from '../../screens/ComapeoSettings/UnitSystemSettings';
import {
  ObservationCreate,
  createNavigationOptions as createObservationCreateNavigationOptions,
} from '../../screens/ObservationCreate';
import {AboutSettings} from '../../screens/ComapeoSettings/About.tsx';
import {CreateTestDataScreen} from '../../screens/ComapeoSettings/CreateTestData.tsx';
import {
  TrackScreen,
  createNavigationOptions as createTrackNavigationOptions,
} from '../../screens/Track/index.tsx';
import {DataAndPrivacy} from '../../screens/ComapeoSettings/DataAndPrivacy/DataAndPrivacy';
import {SettingsPrivacyPolicy} from '../../screens/ComapeoSettings/DataAndPrivacy/SettingsPrivacyPolicy';
import {TrackEdit} from '../../screens/TrackEdit';
import {HeaderLeft as HeaderLeftTrackEdit} from '../../screens/TrackEdit/HeaderLeft';
import {Categories} from '../../screens/Categories.tsx';
import {SaveButton} from '../../sharedComponents/SaveButton.tsx';
import {AddRemoteArchive} from '../../screens/RemoteArchive/AddRemoteArchive.tsx';
import {SuccessfullyAddedArchive} from '../../screens/RemoteArchive/SuccessfullyAddedArchive.tsx';
import {
  createNavigationOptions as createBackgroundMapsNavigationOptions,
  BackgroundMapsScreen,
} from '../../screens/BackgroundMaps/BackgroundMaps.tsx';
import {ExchangeSettingsBottomSheet} from '../../screens/Exchange/ExchangeSettingsBottomSheet.tsx';
import {AudioAskPermissionBottomSheet} from '../../screens/Audio/AudioAskPermissionBottomSheet.tsx';
import {AudioRecording} from '../../screens/Audio/AudioRecording/index.tsx';
import {RemovedFromProjectBottomSheet} from '../../screens/RemovedFromProjectBottomSheet.tsx';
import {ObservationMetadata} from '../../screens/ObservationMetadata.tsx';
import {BackgroundMapErrorBottomSheet} from '../../screens/BackgroundMaps/ErrorBottomSheet.tsx';
import {InviteCollaboratorsScreen} from '../../screens/YourTeam/InviteCollaborators.tsx';
import {StartNewProjectScreen} from '../../screens/ProjectSettings/StartNewProject.tsx';
import {EditProjectDetails} from '../../screens/ProjectSettings/EditProjectDetails.tsx';
import {AllProjects} from '../../screens/AllProjects.tsx';
import {TrackRecordingActive} from '../../screens/TrackRecordingActive.tsx';
import {
  RemoteArchiveScreen,
  createNavigationOptions as createRemoteArchiveNavigationOptions,
} from '../../screens/RemoteArchive/index.tsx';
import {
  RemoveRemoteArchive,
  navigationOptions as removeRemoteArchiveNavigationOptions,
} from '../../screens/RemoteArchive/RemoveRemoteArchive.tsx';
import {ExportObservations} from '../../screens/ExportObservations.tsx';
import {
  ConfirmDeletePhoto,
  navigationOptions as confirmDeletePhotoNavigationOptions,
} from '../../screens/ConfirmDeletePhoto.tsx';
import {AudioDraftPlaybackScreen} from '../../screens/Audio/AudioDraftPlaybackScreen.tsx';
import {AudioAttachmentPlaybackScreen} from '../../screens/Audio/AudioAttachmentPlaybackScreen.tsx';
import {DidNotMoveBottomSheet} from '../../screens/MapScreen/TrackBottomSheet/DidNotMoveBottomSheet.tsx';
import {
  DraftPhotoPreviewModal,
  DraftPhotoPreviewModalNavOptions,
} from '../../screens/PhotoPreviewModal/DraftPhotoPreviewModal.tsx';
import {AttachedPhotoPreviewModal} from '../../screens/PhotoPreviewModal/AttachedPhotoPreviewModal.tsx';
import {sharedPhotoPreviewNavOptions} from '../../screens/PhotoPreviewModal/sharedNavOptions.tsx';
import {ConfirmPasscodeBottomSheet} from '../../screens/ComapeoSettings/Security/AppPasscode/ConfirmPasscodeSheet.tsx';
import {ShareProjectStats} from '../../screens/ProjectCreation/ShareProjectStats.tsx';
import {ExportSuccess} from '../../screens/ExportSuccess.tsx';
import {AppUsagePromptInterstitial} from '../../screens/AppUsagePromptInterstitial.tsx';
import {AppUsageSharingSuccess} from '../../screens/AppUsageSharingSuccess.tsx';
import {ProjectStatistics} from '../../screens/ProjectStatistics/index.tsx';
import {ProjectStatsTurnedOffBottomSheet} from '../../screens/ProjectStatistics/ProjectStatsTurnedOffBottomSheet.tsx';
import {EarlyAccessOffBottomSheet} from '../../screens/ComapeoSettings/EarlyAccessOffBottomSheet.tsx';
import {EarlyAccess} from '../../screens/ComapeoSettings/EarlyAccess.tsx';
import {Collaborate} from '../../screens/ProjectCreation/Collaborate.tsx';
import {JoinAProject} from '../../screens/ProjectCreation/JoinAProject.tsx';
import {StartNewProjectIntro} from '../../screens/ProjectCreation/StartNewProjectIntro.tsx';
import {NameDefaultProjectIntro} from '../../screens/ProjectCreation/NameDefaultProjectIntro.tsx';
import {
  CollaboratorInfo,
  createNavigationOptions as createCollaboratorInfoNavOptions,
} from '../../screens/YourTeam/CollaboratorInfo.tsx';
import {LeaveProject} from '../../screens/YourTeam/LeaveProject.tsx';
import {LeaveProjectWarning} from '../../screens/YourTeam/LeaveProjectWarning.tsx';
import {LeftProjectConfirmation} from '../../screens/YourTeam/LeftProjectConfirmation.tsx';
import {ConfirmDiscardBottomSheet} from '../../screens/TrackEdit/ConfirmDiscardBottomSheet.tsx';
import {ConfirmDiscardObservationBottomSheet} from '../../screens/ObservationCreate/ConfirmDiscardObservationBottomSheet.tsx';
import {ConfirmDiscardObservationEditBottomSheet} from '../../screens/ObservationEdit/ConfirmDiscardObservationEditBottomSheet.tsx';
import {WhatsIncludedBottomSheet} from '../../screens/RemoteArchive/WhatsIncludedBottomSheet.tsx';
import {MapAddedBottomSheet} from '../../screens/BackgroundMaps/MapAddedBottomSheet.tsx';
import {DeleteCustomMapBottomSheet} from '../../screens/BackgroundMaps/DeleteCustomMapBottomSheet.tsx';
import {ConfirmDiscardTrackBottomSheet} from '../../screens/SaveTrack/ConfirmDiscardTrackBottomSheet.tsx';
import {ConfirmDeleteObservationBottomSheet} from '../../screens/Observation/ConfirmDeleteObservationBottomSheet.tsx';
import {ConfirmDeleteTrackBottomSheet} from '../../screens/Track/ConfirmDeleteTrackBottomSheet.tsx';
import {SendingBackgroundMap} from '../../screens/BackgroundMaps/SendingBackgroundMap.tsx';
import {MapReceivedBottomSheet} from '../../screens/BackgroundMaps/MapReceivedBottomSheet.tsx';
import {ReplaceBackgroundMap} from '../../screens/BackgroundMaps/ReplaceBackgroundMap.tsx';
import {ReceivingBackgroundMap} from '../../screens/BackgroundMaps/ReceivingBackgroundMap.tsx';
import {MapShareCanceledBottomSheet} from '../../screens/BackgroundMaps/MapShareCanceledBottomSheet.tsx';
import {EditQADeviceNameScreen} from '../../screens/SetQADeviceName.tsx';
import {isQABuild} from '../../lib/appVariant';

export const TAB_BAR_HEIGHT = 70;

const {formatMessage: intl} = createIntl({locale: 'en', messages: {}});

export const RootStackANavigator = createNativeStackNavigator({
  groups: {
    default: {
      screenOptions: {presentation: 'card'} as NativeStackNavigationOptions,
      screens: {
        Home: {
          screen: HomeTabs,
          options: {headerShown: false},
        },
        ObservationEdit: {
          screen: ObservationEdit,
          options: createObservationEditNavOptions({intl}),
        },
        AddPhoto: {
          screen: AddPhotoScreen,
          options: {headerShown: false},
        },
        AttachedPhotoPreviewModal: {
          screen: AttachedPhotoPreviewModal,
          options: sharedPhotoPreviewNavOptions({intl}),
        },
        ConfirmDeletePhoto: {
          screen: ConfirmDeletePhoto,
          options: confirmDeletePhotoNavigationOptions,
        },
        Security: {
          screen: Security,
          options: intl(Security.navTitle),
        },
        AppPasscode: {
          screen: AppPasscode,
          options: intl(AppPasscode.navTitle),
        },
        DisablePasscode: {
          screen: TurnOffPasscode,
          options: intl(TurnOffPasscode.navTitle),
        },
        SetPasscode: {
          screen: SetPasscode,
          options: intl(SetPasscode.navTitle),
        },
        EnterPassToTurnOff: {
          screen: EnterPassToTurnOff,
          options: intl(EnterPassToTurnOff.navTitle),
        },
        ObscurePasscode: {
          screen: ObscurePasscode,
          options: intl(ObscurePasscode.navTitle),
        },
        TrackCategoryChooser: {
          screen: TrackCategoryChooser,
          options: intl(TrackCategoryChooser.navTitle),
        },
        ObservationCategoryChooser: {
          screen: ObservationCategoryChooser,
          options: intl(ObservationCategoryChooser.navTitle),
        },
        Observation: {
          screen: ObservationScreen,
          options: intl(ObservationScreen.navTitle),
        },
        AppSettings: {
          screen: AppSettings,
          options: intl(AppSettings.navTitle),
        },
        ProjectSettings: {
          screen: ProjectSettings,
          options: intl(ProjectSettings.navTitle),
        },
        CoordinateFormat: {
          screen: CoordinateFormat,
          options: intl(CoordinateFormat.navTitle),
        },
        Collaborate: {
          screen: Collaborate,
          options: intl(Collaborate.navTitle),
        },
        JoinAProject: {
          screen: JoinAProject,
          options: intl(JoinAProject.navTitle),
        },
        CreateProject: {
          screen: CreateOrNameSoloProject,
          options: createNameProjectNavOptions({intl}),
        },
        NameSoloProject: {
          screen: CreateOrNameSoloProject,
          options: createNameProjectNavOptions({intl}),
        },
        ProjectCreated: {
          screen: ProjectCreated,
          options: {headerShown: false},
        },
        YourTeam: {
          screen: YourTeam,
          options: intl(YourTeam.navTitle),
        },
        SelectDevice: {
          screen: SelectInviteDevice,
          options: intl(SelectInviteDevice.navTitle),
        },
        SelectMapShareDevice: {
          screen: SelectMapShareDevice,
          options: intl(SelectMapShareDevice.navTitle),
        },
        SelectInviteeRole: {
          screen: SelectInviteeRole,
          options: intl(SelectInviteeRole.navTitle),
        },
        ReviewAndInvite: {
          screen: ReviewAndInvite,
          options: intl(ReviewInvitation.navTitle),
        },
        InviteAccepted: {
          screen: InviteAccepted,
          options: {headerShown: false},
        },
        RemoveDevice: {
          screen: RemoveDevice,
          options: intl(RemoveDevice.navTitle),
        },
        DeviceRemovedSuccess: {
          screen: DeviceRemovedSuccess,
          options: {headerShown: false},
        },
        DeviceNameDisplay: {
          screen: DeviceNameDisplayScreen,
          options: createDeviceNameDisplayNavOptions({intl}),
        },
        DeviceNameEdit: {
          screen: DeviceNameEditScreen,
          options: createDeviceNameEditNavOptions({intl}),
        },
        GpsModal: {
          screen: LocationInfoScreen,
          options: createLocationInfoNavOptions({intl}),
        },
        SaveTrack: {
          screen: SaveTrackScreen,
        },
        InviteDeclined: {
          screen: InviteDeclined,
          options: {headerShown: false},
        },
        UnableToCancelInvite: {
          screen: UnableToCancelInvite,
          options: {headerShown: false},
        },
        Sync: {
          screen: SyncScreen,
          options: intl(SyncScreen.navTitle),
        },
        ManualGpsScreen: {
          screen: ManualGpsScreen,
          options: createManualGpsNavigationOptions({intl}),
        },
        ObservationFields: {
          screen: ObservationFields,
        },
        LanguageSettings: {
          screen: LanguageSettings,
          options: intl(LanguageSettings.navTitle),
        },
        UnitSystemSettings: {
          screen: UnitSystemSettings,
          options: intl(UnitSystemSettings.navTitle),
        },
        Track: {
          screen: TrackScreen,
          options: createTrackNavigationOptions({intl}),
        },
        ObservationCreate: {
          screen: ObservationCreate,
          options: createObservationCreateNavigationOptions({intl}),
        },
        AboutSettings: {
          screen: AboutSettings,
          options: intl(AboutSettings.navTitle),
        },
        DataAndPrivacy: {
          screen: DataAndPrivacy,
          options: intl(DataAndPrivacy.navTitle),
        },
        SettingsPrivacyPolicy: {
          screen: SettingsPrivacyPolicy,
          options: intl(SettingsPrivacyPolicy.navTitle),
        },
        TrackEdit: {
          screen: TrackEdit,
          options: ({route}: {route: {params: {trackId: string}}}) => ({
            headerTitle: intl(TrackEdit.navTitle),
            headerLeft: (props: {tintColor?: string}) => (
              <HeaderLeftTrackEdit
                trackId={route.params.trackId}
                headerBackButtonProps={props}
              />
            ),
          }),
        },
        Categories: {
          screen: Categories,
          options: intl(Categories.navTitle),
        },
        BackgroundMaps: {
          screen: BackgroundMapsScreen,
          options: createBackgroundMapsNavigationOptions({intl}),
        },
        SendingBackgroundMap: {
          screen: SendingBackgroundMap,
          options: {headerShown: false},
        },
        ReplaceBackgroundMap: {
          screen: ReplaceBackgroundMap,
          options: {headerShown: false},
        },
        ReceivingBackgroundMap: {
          screen: ReceivingBackgroundMap,
          options: {headerShown: false},
        },
        MapShareCanceledBottomSheet: {
          screen: MapShareCanceledBottomSheet,
          options: {
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          },
        },
        ...(process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI && {
          CreateTestData: {
            screen: CreateTestDataScreen,
            options: {headerTitle: 'Create Test Data'},
          },
        }),
        ...(isQABuild && {
          EditQADeviceName: {
            screen: EditQADeviceNameScreen,
            options: {headerTitle: 'QA Device Name'},
          },
        }),
        RemoteArchive: {
          screen: RemoteArchiveScreen,
          options: createRemoteArchiveNavigationOptions({intl}),
        },
        AddRemoteArchive: {
          screen: AddRemoteArchive,
          options: {
            headerTitle: intl(AddRemoteArchive.navTitle),
            headerRight: () => (
              <SaveButton onPress={() => {}} isLoading={false} />
            ),
          },
        },
        SuccessfullyAddedArchive: {
          screen: SuccessfullyAddedArchive,
          options: {headerShown: false},
        },
        RemoveRemoteArchive: {
          screen: RemoveRemoteArchive,
          options: removeRemoteArchiveNavigationOptions,
        },
        AudioRecording: {
          screen: AudioRecording,
          options: {headerShown: false, statusBarStyle: 'light'},
        },
        AudioDraftPlaybackScreen: {
          screen: AudioDraftPlaybackScreen,
          options: {headerShown: false},
        },
        AudioAttachmentPlaybackScreen: {
          screen: AudioAttachmentPlaybackScreen,
          options: intl(AudioAttachmentPlaybackScreen.navTitle),
        },
        ObservationMetadata: {
          screen: ObservationMetadata,
          options: intl(ObservationMetadata.navTitle),
        },
        InviteCollaborators: {
          screen: InviteCollaboratorsScreen,
          options: {headerShown: false},
        },
        StartNewProject: {
          screen: StartNewProjectScreen,
          options: {headerShown: false},
        },
        EditProjectDetails: {
          screen: EditProjectDetails,
          options: {
            headerTitle: intl(EditProjectDetails.navTitle),
            headerRight: () => (
              <SaveButton onPress={() => {}} isLoading={false} />
            ),
          },
        },
        ShareProjectStats: {
          screen: ShareProjectStats,
          options: {headerShown: false},
        },
        DraftPhotoPreviewModal: {
          screen: DraftPhotoPreviewModal,
          options: DraftPhotoPreviewModalNavOptions({intl}),
        },
        AppUsagePromptInterstitial: {
          screen: AppUsagePromptInterstitial,
          options: {headerShown: false},
        },
        AppUsageSharingSuccess: {
          screen: AppUsageSharingSuccess,
          options: {headerShown: false},
        },
        ProjectStatistics: {
          screen: ProjectStatistics,
          options: intl(ProjectStatistics.navTitle),
        },
        EarlyAccess: {
          screen: EarlyAccess,
          options: intl(EarlyAccess.navTitle),
        },
        StartNewProjectIntro: {
          screen: StartNewProjectIntro,
          options: intl(StartNewProjectIntro.navTitle),
        },
        NameDefaultProjectIntro: {
          screen: NameDefaultProjectIntro,
          options: intl(NameDefaultProjectIntro.navTitle),
        },
        LeaveProjectWarning: {
          screen: LeaveProjectWarning,
          options: {headerShown: false},
        },
        LeaveProject: {
          screen: LeaveProject,
          options: {headerShown: false},
        },
        LeftProjectConfirmation: {
          screen: LeftProjectConfirmation,
          options: {headerShown: false},
        },
        CollaboratorInfo: {
          screen: CollaboratorInfo,
          options: createCollaboratorInfoNavOptions({intl}),
        },
        ExportObservations: {
          screen: ExportObservations,
          options: intl(ExportObservations.navTitle),
        },
      },
    },
    bottomSheets: {
      screenOptions: {
        presentation: 'transparentModal',
        headerShown: false,
        animation: 'none',
        contentStyle: {backgroundColor: 'transparent'},
      } as NativeStackNavigationOptions,
      screens: {
        ExchangeSettingsBottomSheet: {
          screen: ExchangeSettingsBottomSheet,
        },
        AudioAskPermissionBottomSheet: {
          screen: AudioAskPermissionBottomSheet,
        },
        RemovedFromProjectBottomSheet: {
          screen: RemovedFromProjectBottomSheet,
        },
        BackgroundMapErrorBottomSheet: {
          screen: BackgroundMapErrorBottomSheet,
        },
        TrackRecordingActive: {
          screen: TrackRecordingActive,
        },
        DidNotMoveBottomSheet: {
          screen: DidNotMoveBottomSheet,
        },
        ConfirmPasscodeSheet: {
          screen: ConfirmPasscodeBottomSheet,
        },
        TurnOffPasscodeBottomSheet: {
          screen: TurnOffPasscodeBottomSheet,
        },
        ExportSuccess: {
          screen: ExportSuccess,
          options: {
            contentStyle: {backgroundColor: 'white'},
          },
        },
        ProjectStatsTurnedOff: {
          screen: ProjectStatsTurnedOffBottomSheet,
        },
        EarlyAccessOff: {
          screen: EarlyAccessOffBottomSheet,
        },
        AllProjects: {
          screen: AllProjects,
          options: {
            headerShown: false,
          },
        },
        ConfirmTrackDiscardBottomSheet: {
          screen: ConfirmDiscardBottomSheet,
        },
        DeleteCustomMapBottomSheet: {
          screen: DeleteCustomMapBottomSheet,
        },
        MapAddedBottomSheet: {
          screen: MapAddedBottomSheet,
        },
        WhatsIncludedBottomSheet: {
          screen: WhatsIncludedBottomSheet,
        },
        ConfirmDiscardObservationBottomSheet: {
          screen: ConfirmDiscardObservationBottomSheet,
        },
        ConfirmDiscardObservationEditBottomSheet: {
          screen: ConfirmDiscardObservationEditBottomSheet,
        },
        ConfirmDiscardTrackBottomSheet: {
          screen: ConfirmDiscardTrackBottomSheet,
        },
        ConfirmDeleteObservationBottomSheet: {
          screen: ConfirmDeleteObservationBottomSheet,
        },
        ConfirmDeleteTrackBottomSheet: {
          screen: ConfirmDeleteTrackBottomSheet,
        },
        MapReceivedBottomSheet: {
          screen: MapReceivedBottomSheet,
        },
      },
    },
  },
});
