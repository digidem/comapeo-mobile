import * as React from 'react';
import {RootStack} from '.';
import {MessageDescriptor} from 'react-intl';
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
import {ObservationScreen} from '../../screens/Observation';
import {AppSettings} from '../../screens/Settings/AppSettings';
import {ProjectSettings} from '../../screens/Settings/ProjectSettings';
import {CoordinateFormat} from '../../screens/Settings/AppSettings/CoordinateFormat';
import {CustomHeaderLeftClose} from '../../sharedComponents/CustomHeaderLeftClose';
import {CreateOrJoinProject} from '../../screens/Settings/CreateOrJoinProject';
import {CreateProject} from '../../screens/Settings/CreateOrJoinProject/CreateProject';
import {ProjectCreated} from '../../screens/Settings/CreateOrJoinProject/CreateProject/ProjectCreated';
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
import {SharedLocationContextProvider} from '../../contexts/SharedLocationContext';
import {
  SyncScreen,
  createNavigationOptions as createSyncNavOptions,
} from '../../screens/Sync';
import {
  ManualGpsScreen,
  createNavigationOptions as createManualGpsNavigationOptions,
} from '../../screens/ManualGpsScreen';
import {HomeTabs} from '../Tab';
import {SaveTrackScreen} from '../../screens/SaveTrack/SaveTrackScreen';
import {ObservationFields} from '../../screens/ObservationFields';
import {LIGHT_GREY, WHITE} from '../../lib/styles';
import {LanguageSettings} from '../../screens/Settings/AppSettings/LanguageSettings';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {PhotoPreviewModal} from '../../screens/PhotoPreviewModal.tsx';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';
import {TrackScreen} from '../../screens/Track/index.tsx';
import {AboutSettings} from '../../screens/Settings/About.tsx';

export const TAB_BAR_HEIGHT = 70;

// **NOTE**: No hooks allowed here (this is not a component, it is a function
// that returns a react element)
export const createDefaultScreenGroup = ({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) => (
  <RootStack.Group key="default">
    <RootStack.Screen
      name="Home"
      options={{headerShown: false}}
      children={() => (
        <SharedLocationContextProvider>
          {/* This provider allows the bottoms sheet used by tracks to open up behind the drawers */}
          <BottomSheetModalProvider>
            <HomeTabs />
          </BottomSheetModalProvider>
        </SharedLocationContextProvider>
      )}
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
          headerShadowVisible: false,
          contentStyle: {
            borderTopColor: LIGHT_GREY,
            borderTopWidth: 1,
          },
          headerLeft: headerProp => (
            <CustomHeaderLeftClose
              headerBackButtonProps={headerProp}
              observationId={observationId}
            />
          ),
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
      name="PhotoPreviewModal"
      component={PhotoPreviewModal}
      options={{
        headerTitle: '',
        headerTransparent: true,
        headerStyle: {backgroundColor: 'transparent'},
        headerLeft: props => (
          <CustomHeaderLeft tintColor={WHITE} headerBackButtonProps={props} />
        ),
      }}
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
      options={createSyncNavOptions()}
    />
    <RootStack.Screen
      name="ManualGpsScreen"
      component={ManualGpsScreen}
      options={createManualGpsNavigationOptions({intl})}
    />
    <RootStack.Screen name="ObservationFields" component={ObservationFields} />
    <RootStack.Screen
      name="LanguageSettings"
      component={LanguageSettings}
      options={{headerTitle: intl(LanguageSettings.navTitle)}}
    />
    <RootStack.Screen
      name="Track"
      component={TrackScreen}
      options={{headerTitle: intl(TrackScreen.navTitle)}}
    />
    <RootStack.Screen
      name="AboutSettings"
      component={AboutSettings}
      options={{headerTitle: intl(AboutSettings.navTitle)}}
    />
  </RootStack.Group>
);
