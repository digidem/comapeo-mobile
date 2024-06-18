import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {WHITE} from '../../lib/styles';

import {ErrorBottomSheet} from '../ErrorBottomSheet';

import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {DescriptionField} from './DescriptionField';
import {ActionButtons} from './ActionButtons';
import {MediaScrollView} from '../MediaScrollView';
import {PresetAndLocationView} from './PresetAndLocationView';

type EditScreenProps = {
  presetName: string;
  onPressPreset?: () => void;
  PresetIcon: React.ReactNode;
  showAudio?: boolean;
  error: Error | null;
  clearError: () => void;
  notes: string;
  updateNotes: (newNotes: string) => void;
  photos: (Partial<Photo> | undefined)[];
  audioRecordings: any[];
  location?: {
    lat: number | undefined;
    lon: number | undefined;
    accuracy: number | undefined;
  };
  fieldIds?: string[];
};

export const EditScreen = ({
  presetName,
  onPressPreset,
  PresetIcon,
  showAudio,
  error,
  clearError,
  notes,
  updateNotes,
  photos,
  audioRecordings,
  location,
  fieldIds,
}: EditScreenProps) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PresetAndLocationView
          onPressPreset={onPressPreset}
          presetName={presetName}
          PresetIcon={PresetIcon}
          location={location}
        />
        <DescriptionField notes={notes} updateNotes={updateNotes} />
      </ScrollView>
      <MediaScrollView photos={photos} audioRecordings={audioRecordings} />
      <ActionButtons fieldIds={fieldIds} showAudio={!!showAudio} />
      <ErrorBottomSheet error={error} clearError={clearError} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    flexDirection: 'column',
    alignContent: 'stretch',
    padding: 20,
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
});
