import {AudioPrepareRecordingScreen} from '../../screens/Audio/AudioPrepareRecordingScreen.tsx';
import {AudioRecordingScreen} from '../../screens/Audio/AudioRecordingScreen.tsx';
import {AudioPlaybackScreen} from '../../screens/Audio/AudioPlaybackScreen.tsx';
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AudioStackParamList} from '../../sharedTypes/navigation.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WHITE} from '../../lib/styles.ts';
import {useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator<AudioStackParamList>();

export const AudioStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PrepareRecording"
        component={AudioPrepareRecordingScreen}
        options={{
          headerStyle: {backgroundColor: 'transparent'},
          headerLeft: () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks -- it is a component
            const navigation = useNavigation();
            return (
              <MaterialIcons
                name="west"
                size={24}
                color={WHITE}
                onPress={navigation.goBack}
              />
            );
          },
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="Recording"
        component={AudioRecordingScreen}
        options={{
          headerLeft: () => <></>,
          headerStyle: {backgroundColor: 'transparent'},
          headerTransparent: true,
          headerTitle: '',
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="Playback"
        component={AudioPlaybackScreen}
        options={{
          headerStyle: {backgroundColor: 'transparent'},
          headerTransparent: true,
          headerTitle: '',
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
};
