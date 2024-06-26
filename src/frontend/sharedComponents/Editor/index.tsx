import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {WHITE} from '../../lib/styles';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {DescriptionField} from './DescriptionField';
import {ActionButtons} from './ActionButtons';
import {MediaScrollView} from '../MediaScrollView';
import {PresetAndLocationView} from './PresetAndLocationView';

type EditorProps = {
  presetName: string;
  onPressPreset?: () => void;
  PresetIcon: React.ReactNode;
  showAudio?: boolean;
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

export const Editor = ({
  presetName,
  onPressPreset,
  PresetIcon,
  showAudio,
  notes,
  updateNotes,
  photos,
  audioRecordings,
  location,
  fieldIds,
}: EditorProps) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
});
