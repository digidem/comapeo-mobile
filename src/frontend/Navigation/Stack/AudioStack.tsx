import {AudioPrepareRecordingScreen} from '../../screens/Audio/AudioPrepareRecordingScreen.tsx';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import NavigationBackButton from '../../images/navigationBackButton.svg';
import {AudioRecordingScreen} from '../../screens/Audio/AudioRecordingScreen.tsx';
import {AudioPlaybackScreen} from '../../screens/Audio/AudioPlaybackScreen.tsx';
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AudioStackParamList} from '../../sharedTypes/navigation.ts';
import {AUDIO_BLACK} from '../../lib/styles.ts';

const Stack = createNativeStackNavigator<AudioStackParamList>();

export const AudioStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PrepareRecording"
        component={AudioPrepareRecordingScreen}
        options={{
          headerStyle: {backgroundColor: AUDIO_BLACK},
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
