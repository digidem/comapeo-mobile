import * as React from 'react';
import {RootStack} from '.';
import {MessageDescriptor} from 'react-intl';
import {
  ObservationEdit,
  createNavigationOptions as createObservationEditNavOptions,
} from '../../screens/ObservationEdit';
import {AddPhotoScreen} from '../../screens/AddPhoto';
import {AppPasscode} from '../../screens/AppPasscode';
import {EnterPassToTurnOff} from '../../screens/AppPasscode/EnterPassToTurnOff';
import {SetPasscode} from '../../screens/AppPasscode/SetPasscode';
import {TurnOffPasscode} from '../../screens/AppPasscode/TurnOffPasscode';
import {Security} from '../../screens/Security';
import {AuthScreen} from '../../screens/AuthScreen';
import {ObscurePasscode} from '../../screens/ObscurePasscode';
import {ObservationCategoryChooser} from '../../screens/PresetChooser/ObservationCategoryChooser.tsx';
import {TrackCategoryChooser} from '../../screens/PresetChooser/TrackCategoryChooser.tsx';
import {ObservationScreen} from '../../screens/Observation';
import {AppSettings} from '../../screens/Settings/AppSettings';
import {ProjectSettings} from '../../screens/Settings/ProjectSettings';
import {CoordinateFormat} from '../../screens/Settings/AppSettings/CoordinateFormat';
import {CreateOrJoinProject} from '../../screens/Settings/CreateOrJoinProject';
import {
  CreateOrNameSoloProject,
  createNavigationOptions as createNameProjectNavOptions,
} from '../../screens/Settings/CreateOrJoinProject/CreateOrNameSoloProject';
import {ProjectCreated} from '../../screens/Settings/CreateOrJoinProject/CreateOrNameSoloProject/ProjectCreated';
import {JoinExistingProject} from '../../screens/Settings/CreateOrJoinProject/JoinExistingProject';
import {YourTeam} from '../../screens/Settings/ProjectSettings/YourTeam';
import {SelectDevice} from '../../screens/Settings/ProjectSettings/YourTeam/SelectDevice';
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
  LocationInfoScreen,
  createNavigationOptions as createLocationInfoNavOptions,
} from '../../screens/LocationInfoScreen';
import {InviteDeclined} from '../../screens/Settings/ProjectSettings/YourTeam/InviteDeclined';
import {UnableToCancelInvite} from '../../screens/Settings/ProjectSettings/YourTeam/ReviewAndInvite/UnableToCancelInvite';
import {SyncScreen} from '../../screens/Exchange/index.tsx';
import {
  ManualGpsScreen,
  createNavigationOptions as createManualGpsNavigationOptions,
} from '../../screens/ManualGpsScreen';
import {HomeTabs} from '../Tab';
import {SaveTrackScreen} from '../../screens/SaveTrack/SaveTrackScreen';
import {ObservationFields} from '../../screens/ObservationFields';
import {LanguageSettings} from '../../screens/Settings/AppSettings/LanguageSettings';
import {
  ObservationCreate,
  createNavigationOptions as createObservationCreateNavigationOptions,
} from '../../screens/ObservationCreate';
import {AboutSettings} from '../../screens/Settings/About';
import {CreateTestDataScreen} from '../../screens/Settings/CreateTestData';
import {
  TrackScreen,
  createNavigationOptions as createTrackNavigationOptions,
} from '../../screens/Track/index.tsx';
import {DataAndPrivacy} from '../../screens/Settings/DataAndPrivacy/DataAndPrivacy';
import {SettingsPrivacyPolicy} from '../../screens/Settings/DataAndPrivacy/SettingsPrivacyPolicy';
import {TrackEdit} from '../../screens/TrackEdit/index.tsx';
import {Config} from '../../screens/Settings/Config';
import {SaveButton} from '../../sharedComponents/SaveButton.tsx';
import {AddRemoteArchive} from '../../screens/Settings/ProjectSettings/RemoteArchive/AddRemoteArchive.tsx';
import {SuccessfullyAddedArchive} from '../../screens/Settings/ProjectSettings/RemoteArchive/SuccessfullyAddedArchive.tsx';
import {
  createNavigationOptions as createBackgroundMapsNavigationOptions,
  BackgroundMapsScreen,
} from '../../screens/Settings/MapManagement/BackgroundMaps.tsx';
import {ExchangeSettingsBottomSheet} from '../../screens/Exchange/ExchangeSettingsBottomSheet.tsx';
import {AudioAskPermissionBottomSheet} from '../../screens/Audio/AudioAskPermissionBottomSheet.tsx';
import {AudioRecording} from '../../screens/Audio/AudioRecording/index.tsx';
import {InviteReceived} from '../../screens/Invites/InviteReceived.tsx';
import {InviteSuccessfullyAccepted} from '../../screens/Invites/InviteSuccessfullyAccepted.tsx';
import {InviteCanceled} from '../../screens/Invites/InviteCanceled.tsx';
import {ObservationMetadata} from '../../screens/ObservationMetadata.tsx';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet.tsx';
import {BackgroundMapErrorBottomSheet} from '../../screens/Settings/MapManagement/ErrorBottomSheet.tsx';
import {MenuScreen} from '../../screens/MenuScreen';
import {InviteCollaboratorsScreen} from '../../screens/Settings/ProjectSettings/YourTeam/InviteCollaborators.tsx';
import {StartNewProjectScreen} from '../../screens/Settings/ProjectSettings/StartNewProject.tsx';
import {MenuHeader} from '../../sharedComponents/MenuHeader.tsx';
import {EditProjectDetails} from '../../screens/Settings/ProjectSettings/EditProjectDetails.tsx';
import {AllProjects} from '../../screens/AllProjects.tsx';
import {TrackRecordingActive} from '../../screens/TrackRecordingActive.tsx';
import {
  RemoteArchiveScreen,
  createNavigationOptions as createRemoteArchiveNavigationOptions,
} from '../../screens/Settings/ProjectSettings/RemoteArchive/index.tsx';
import {
  RemoveRemoteArchive,
  navigationOptions as removeRemoteArchiveNavigationOptions,
} from '../../screens/Settings/ProjectSettings/RemoteArchive/RemoveRemoteArchive.tsx';
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
import {ConfirmPasscodeBottomSheet} from '../../screens/AppPasscode/ConfirmPasscodeSheet.tsx';
import {ShareProjectStats} from '../../screens/Settings/CreateOrJoinProject/ShareProjectStats.tsx';
import {ExportSuccess} from '../../screens/ExportSuccess.tsx';
import {ProjectStatistics} from '../../screens/Settings/ProjectSettings/ProjectStatistics/index.tsx';
import {ProjectStatsTurnedOffBottomSheet} from '../../screens/Settings/ProjectSettings/ProjectStatistics/ProjectStatsTurnedOffBottomSheet.tsx';

export const TAB_BAR_HEIGHT = 70;

export const createAppScreens = ({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) => (
  <>
    <RootStack.Group screenOptions={{presentation: 'card'}} key="default">
      <RootStack.Screen
        name="Home"
        options={{headerShown: false}}
        component={HomeTabs}
      />
      <RootStack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <RootStack.Screen
        name="ObservationEdit"
        component={ObservationEdit}
        options={createObservationEditNavOptions({intl})}
      />
      <RootStack.Screen
        name="AddPhoto"
        component={AddPhotoScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AttachedPhotoPreviewModal"
        component={AttachedPhotoPreviewModal}
        options={sharedPhotoPreviewNavOptions({intl})}
      />
      <RootStack.Screen
        name="ConfirmDeletePhoto"
        component={ConfirmDeletePhoto}
        options={confirmDeletePhotoNavigationOptions}
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
      <RootStack.Screen
        name="TrackCategoryChooser"
        component={TrackCategoryChooser}
        options={{headerTitle: intl(TrackCategoryChooser.navTitle)}}
      />
      <RootStack.Screen
        name="ObservationCategoryChooser"
        component={ObservationCategoryChooser}
        options={{headerTitle: intl(ObservationCategoryChooser.navTitle)}}
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
        component={CreateOrNameSoloProject}
        options={createNameProjectNavOptions({intl})}
      />
      <RootStack.Screen
        name="NameSoloProject"
        component={CreateOrNameSoloProject}
        options={createNameProjectNavOptions({intl})}
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
        component={LocationInfoScreen}
        options={createLocationInfoNavOptions({intl})}
      />
      <RootStack.Screen name="SaveTrack" component={SaveTrackScreen} />
      <RootStack.Screen
        name="InviteDeclined"
        component={InviteDeclined}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="UnableToCancelInvite"
        component={UnableToCancelInvite}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="Sync"
        component={SyncScreen}
        options={{headerTitle: intl(SyncScreen.navTitle)}}
      />
      <RootStack.Screen
        name="ManualGpsScreen"
        component={ManualGpsScreen}
        options={createManualGpsNavigationOptions({intl})}
      />
      <RootStack.Screen
        name="ObservationFields"
        component={ObservationFields}
      />
      <RootStack.Screen
        name="LanguageSettings"
        component={LanguageSettings}
        options={{headerTitle: intl(LanguageSettings.navTitle)}}
      />
      <RootStack.Screen
        name="Track"
        component={TrackScreen}
        options={createTrackNavigationOptions({intl})}
      />

      <RootStack.Screen
        name="ObservationCreate"
        component={ObservationCreate}
        options={createObservationCreateNavigationOptions({intl})}
      />

      <RootStack.Screen
        name="AboutSettings"
        component={AboutSettings}
        options={{headerTitle: intl(AboutSettings.navTitle)}}
      />
      <RootStack.Screen
        name="DataAndPrivacy"
        component={DataAndPrivacy}
        options={{headerTitle: intl(DataAndPrivacy.navTitle)}}
      />
      <RootStack.Screen
        name="SettingsPrivacyPolicy"
        component={SettingsPrivacyPolicy}
        options={{headerTitle: intl(SettingsPrivacyPolicy.navTitle)}}
      />
      <RootStack.Screen
        name="TrackEdit"
        component={TrackEdit}
        options={{headerTitle: intl(TrackEdit.navTitle)}}
      />
      <RootStack.Screen
        name="Config"
        component={Config}
        options={{headerTitle: intl(Config.navTitle)}}
      />
      <RootStack.Screen
        name="BackgroundMaps"
        component={BackgroundMapsScreen}
        options={createBackgroundMapsNavigationOptions({intl})}
      />

      {process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI && (
        <RootStack.Screen
          name="CreateTestData"
          component={CreateTestDataScreen}
          options={{headerTitle: 'Create Test Data'}}
        />
      )}
      <RootStack.Screen
        name="RemoteArchive"
        component={RemoteArchiveScreen}
        options={createRemoteArchiveNavigationOptions({intl})}
      />
      <RootStack.Screen
        name="AddRemoteArchive"
        component={AddRemoteArchive}
        options={{
          headerTitle: intl(AddRemoteArchive.navTitle),
          headerRight: () => (
            <SaveButton onPress={() => {}} isLoading={false} />
          ),
        }}
      />
      <RootStack.Screen
        name="SuccessfullyAddedArchive"
        component={SuccessfullyAddedArchive}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="RemoveRemoteArchive"
        component={RemoveRemoteArchive}
        options={removeRemoteArchiveNavigationOptions}
      />
      <RootStack.Screen
        name="AudioRecording"
        component={AudioRecording}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AudioDraftPlaybackScreen"
        component={AudioDraftPlaybackScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AudioAttachmentPlaybackScreen"
        component={AudioAttachmentPlaybackScreen}
        options={{headerTitle: intl(AudioAttachmentPlaybackScreen.navTitle)}}
      />
      <RootStack.Screen
        name="ObservationMetadata"
        component={ObservationMetadata}
        options={{headerTitle: intl(ObservationMetadata.navTitle)}}
      />
      <RootStack.Screen
        name="AllProjects"
        component={AllProjects}
        options={{headerTitle: intl(AllProjects.navTitle)}}
      />
      <RootStack.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          header: () => <MenuHeader />,
        }}
      />
      <RootStack.Screen
        name="InviteCollaborators"
        component={InviteCollaboratorsScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="StartNewProject"
        component={StartNewProjectScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="EditProjectDetails"
        component={EditProjectDetails}
        options={{
          headerTitle: intl(EditProjectDetails.navTitle),
          headerRight: () => (
            <SaveButton onPress={() => {}} isLoading={false} />
          ),
        }}
      />
      <RootStack.Screen
        name="ShareProjectStats"
        component={ShareProjectStats}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DraftPhotoPreviewModal"
        component={DraftPhotoPreviewModal}
        options={DraftPhotoPreviewModalNavOptions({intl})}
      />
      <RootStack.Screen
        name="ProjectStatistics"
        component={ProjectStatistics}
        options={{headerTitle: intl(ProjectStatistics.navTitle)}}
      />
    </RootStack.Group>
    <RootStack.Group
      screenOptions={{
        presentation: 'transparentModal',
        headerShown: false,
        animation: 'none',
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <RootStack.Screen
        name="ExchangeSettingsBottomSheet"
        component={ExchangeSettingsBottomSheet}
      />
      <RootStack.Screen
        name="AudioAskPermissionBottomSheet"
        component={AudioAskPermissionBottomSheet}
      />
      <RootStack.Screen name="InviteReceived" component={InviteReceived} />
      <RootStack.Screen
        name="InviteSuccessfullyAccepted"
        component={InviteSuccessfullyAccepted}
      />
      <RootStack.Screen name="InviteCanceled" component={InviteCanceled} />
      <RootStack.Screen name="ErrorBottomSheet" component={ErrorBottomSheet} />
      <RootStack.Screen
        name="BackgroundMapErrorBottomSheet"
        component={BackgroundMapErrorBottomSheet}
      />
      <RootStack.Screen
        name="TrackRecordingActive"
        component={TrackRecordingActive}
      />
      <RootStack.Screen
        name="ExportObservations"
        component={ExportObservations}
      />
      <RootStack.Screen
        name="DidNotMoveBottomSheet"
        component={DidNotMoveBottomSheet}
      />
      <RootStack.Screen
        name="ConfirmPasscodeSheet"
        component={ConfirmPasscodeBottomSheet}
      />
      <RootStack.Screen
        name="ExportSuccess"
        component={ExportSuccess}
        options={{
          contentStyle: {backgroundColor: 'white'},
        }}
      />
      <RootStack.Screen
        name="ProjectStatsTurnedOff"
        component={ProjectStatsTurnedOffBottomSheet}
      />
    </RootStack.Group>
  </>
);
