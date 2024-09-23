import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';
import {Audio} from 'expo-av';

type AudioRecordingIdle = {status: 'idle'};

type AudioRecordingActive = {
  status: 'active';
  /**
   * Time elapsed in milliseconds
   */
  duration: number;
  uri: string;
};

type AudioRecordingDone = {
  status: 'done';
  /**
   * Time elapsed in milliseconds
   */
  duration: number;
  uri: string;
};

type AudioRecordingState =
  | AudioRecordingIdle
  | AudioRecordingActive
  | AudioRecordingDone;

export class AudioRecordingStore {
  #state: {
    recording: Audio.Recording;
    status: Audio.RecordingStatus;
    uri: string;
  } | null = null;

  #listeners = new Set<() => void>();

  constructor() {}

  #notifyListeners = () => {
    for (const s of this.#listeners) {
      s();
    }
  };

  startRecording = async () => {
    const {recording, status} = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      status => {
        if (!this.#state) return;

        this.#state = {
          ...this.#state,
          status,
        };

        this.#notifyListeners();
      },
    );

    const uri = recording.getURI();

    // Should not happen
    if (uri === null) {
      throw new Error('Could not get URI for recording');
    }

    this.#state = {recording, status, uri};

    this.#notifyListeners();

    return uri;
  };

  stopRecording = async () => {
    if (!this.#state)
      throw new Error(
        'Cannot call stopRecording before startRecording has been initialized',
      );

    const status = await this.#state.recording.stopAndUnloadAsync();

    this.#state = {
      ...this.#state,
      status,
    };

    this.#notifyListeners();

    return this.#state.uri;
  };

  resetRecording = async () => {
    const {status} = this.getSnapshot();

    if (status === 'active') {
      await this.#state!.recording.stopAndUnloadAsync();
    }

    this.#state = null;
    this.#notifyListeners();
  };

  subscribe = (listener: () => void) => {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  getSnapshot = (): AudioRecordingState => {
    if (!this.#state) {
      return {status: 'idle'};
    }

    if (this.#state.status.isDoneRecording) {
      return {
        status: 'done',
        duration: this.#state.status.durationMillis,
        uri: this.#state.uri,
      };
    }

    return {
      status: 'active',
      duration: this.#state.status.durationMillis,
      uri: this.#state.uri,
    };
  };
}

const AudioRecordingStoreContext = createContext<AudioRecordingStore | null>(
  null,
);

export const AudioRecordingStoreProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [store] = useState(() => {
    return new AudioRecordingStore();
  });

  return (
    <AudioRecordingStoreContext.Provider value={store}>
      {children}
    </AudioRecordingStoreContext.Provider>
  );
};

function useAudioRecordingStore() {
  const store = useContext(AudioRecordingStoreContext);
  if (!store) {
    throw new Error(
      'useAudioRecordingStore must be used within an AudioRecordingStoreProvider',
    );
  }
  return store;
}

export function useAudioRecordingActions() {
  const {startRecording, stopRecording, resetRecording} =
    useAudioRecordingStore();
  return {startRecording, stopRecording, resetRecording};
}

export function useAudioRecording() {
  const store = useAudioRecordingStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
