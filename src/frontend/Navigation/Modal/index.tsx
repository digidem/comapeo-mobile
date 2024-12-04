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

export type ModalScreens = {
  MediaSyncModal: {
    value: MediaSyncSetting;
  };
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
    </ModalStack.Navigator>
  );
};

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
