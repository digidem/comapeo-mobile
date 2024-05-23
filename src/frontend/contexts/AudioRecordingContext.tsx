import {Recording, RecordingStatus} from 'expo-av/build/Audio/Recording';
import React, {createContext, useContext, useState} from 'react';
import {RecordingOptionsPresets} from 'expo-av/src/Audio/RecordingConstants.ts';

interface AudioRecordingContext {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  hasStarted: boolean;
  hasFinished: boolean;
  timeElapsed: number;
  // Available only after hasStarted === true
  recording: Recording | null;
}

const AudioRecordingContext = createContext<AudioRecordingContext | null>(null);

const AudioRecordingContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasStarted, setStarted] = useState(false);
  const [hasFinished, setFinished] = useState(false);

  const [recording, setRecording] = useState<Recording | null>(null);

  const recordingUpdateHandler = (status: RecordingStatus) => {
    setTimeElapsed(status.durationMillis);
    if (status.isDoneRecording) {
      setFinished(true);
      setStarted(false);
    }
  };

  const startRecording = async () => {
    if (hasStarted) {
      console.warn(
        'startRecording from AudioRecordingContext called while recording is already in progress',
      );
      return;
    }
    const {recording: newRecording, status} = await Recording.createAsync(
      RecordingOptionsPresets.HIGH_QUALITY,
    );
    newRecording.setOnRecordingStatusUpdate(recordingUpdateHandler);
    setStarted(status.isRecording);
    setFinished(false);
    setTimeElapsed(0);
    setRecording(newRecording);
  };

  const stopRecording = async () => {
    if (!hasStarted) {
      console.warn(
        'stopRecording from AudioRecordingContext called while recording has not been started',
      );
      return;
    }
    await recording!.stopAndUnloadAsync();
    setFinished(true);
    setStarted(false);
  };

  return (
    <AudioRecordingContext.Provider
      value={{
        startRecording,
        stopRecording,
        timeElapsed,
        hasStarted,
        hasFinished,
        recording,
      }}>
      {children}
    </AudioRecordingContext.Provider>
  );
};

const useAudioRecordingContext = () => {
  const context = useContext(AudioRecordingContext);
  if (!context) {
    throw new Error(
      'useAudioRecordingContext must be used within a AudioRecordingContextProvider',
    );
  }
  return context;
};

export {AudioRecordingContextProvider, useAudioRecordingContext};
