import * as React from 'react';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {BodyText} from '../../sharedComponents/Text/BodyText';
import {View} from 'react-native';
import {Button} from '../../sharedComponents/Button';
import {MediaSyncSetting} from '../../sharedTypes';
import {usePersistedSettingsAction} from '../../hooks/persistedState/usePersistedSettings';
import {InviteInternal} from '@comapeo/core/dist/invite-api';
import {MapBuffers} from '@comapeo/core/dist/types';

export type ModalScreens = {
  MediaSyncModal: {
    value: MediaSyncSetting;
  };
  InviteModalRoot: {invite: MapBuffers<InviteInternal>};
  ErrorModal: undefined;
};

const ModalStack = createNativeStackNavigator<ModalScreens>();

export const ModalStackNavigator = () => {
  return (
    <ModalStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
        contentStyle: {
          backgroundColor: 'transparent',
          justifyContent: 'flex-end',
        },
      }}>
      <ModalStack.Screen
        component={MediaSyncSettingsModal}
        name="MediaSyncModal"
      />
      <ModalStack.Screen component={InviteModalRoot} name="InviteModalRoot" />
      <ModalStack.Screen component={ErrorModal} name="ErrorModal" />
    </ModalStack.Navigator>
  );
};

function ErrorModal({
  navigation,
  route,
}: NativeStackScreenProps<ModalScreens, 'ErrorModal'>) {
  return (
    <View
      style={{
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        height: 400,
        // flex: 1,
      }}>
      <View>
        <BodyText>Error occurred</BodyText>
        <Button
          onPress={() => {
            navigation.goBack();
          }}>
          <BodyText>Try Again</BodyText>
        </Button>
        <Button
          onPress={() => {
            navigation.goBack();
          }}>
          <BodyText>Go Back</BodyText>
        </Button>
      </View>
    </View>
  );
}

export type InviteScreens = {
  Received: {invite: MapBuffers<InviteInternal>};
  Accepted: {invite: MapBuffers<InviteInternal>};
  Rejected: {invite: MapBuffers<InviteInternal>};
  Cancelled: {invite: MapBuffers<InviteInternal>};
};

const InviteStack = createNativeStackNavigator<InviteScreens>();

function InviteModalRoot({
  route,
  navigation,
}: NativeStackScreenProps<ModalScreens, 'InviteModalRoot'>) {
  const invite = route.params.invite;

  // useInviteCancelledEffect(
  //   invite => {
  //     if (invite.id !== inviteId) return;
  //     navigation.push('InviteCancelledScreen');
  //   },
  //   [inviteId],
  // );

  return (
    <InviteStack.Navigator>
      <InviteStack.Screen name="Received" component={InviteReceived} />
      {/* <InviteStack.Screen name="Accepted" component={} /> */}
    </InviteStack.Navigator>
  );
}

function InviteReceived({
  navigation,
  route,
}: NativeStackScreenProps<InviteScreens, 'Received'>) {
  return (
    <View
      style={{
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        height: 400,
      }}>
      <View>
        <BodyText>Invite Received</BodyText>
        <Button
          onPress={() => {
            navigation.navigate('Accepted', {invite: route.params.invite});
          }}>
          <BodyText>Accept</BodyText>
        </Button>
        <Button
          onPress={() => {
            navigation.navigate('Rejected', {invite: route.params.invite});
          }}>
          <BodyText>Reject</BodyText>
        </Button>
      </View>
    </View>
  );
}

function useInviteCancelledEffect(cb) {}

function MediaSyncSettingsModal({
  navigation,
  route,
}: NativeStackScreenProps<ModalScreens, 'MediaSyncModal'>) {
  const value = route.params.value;
  const {setMediaSyncSetting} = usePersistedSettingsAction();
  return (
    <View
      style={{
        justifyContent: 'flex-end',
        backgroundColor: 'yellow',
        height: 400,
        // flex: 1,
      }}>
      <View>
        <BodyText>Hello</BodyText>
        <Button
          onPress={() => {
            setMediaSyncSetting(value);
            navigation.goBack();
          }}>
          <BodyText>Set to ${value}?</BodyText>
        </Button>
        <Button
          onPress={() => {
            navigation.goBack();
          }}>
          <BodyText>Close</BodyText>
        </Button>
      </View>
    </View>
  );
}
