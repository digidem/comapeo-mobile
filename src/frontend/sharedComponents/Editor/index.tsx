import * as React from 'react';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {DescriptionField} from './DescriptionField';
import {MediaScrollView} from '../MediaScrollView';
import {ScreenContentWithDock} from '../ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import {PresetView} from './PresetView';
import {LocationView} from './LocationView';
import {Divider} from '../Divider';

type EditorProps = {
  presetName: string;
  onPressPreset?: () => void;
  PresetIcon: React.ReactNode;
  notes?: string;
  updateNotes?: (newNotes: string) => void;
  photos: Photo[];
  location?: {
    lat: number | undefined;
    lon: number | undefined;
    accuracy: number | undefined;
  };
  actionsRow?: React.ReactNode;
  notesComponent?: React.ReactNode;
  isTrack?: boolean;
  presetDisabled?: boolean;
};

export const Editor = ({
  notes,
  updateNotes,
  photos,
  location,
  actionsRow,
  notesComponent,
  isTrack = false,
  ...presetProps
}: EditorProps) => {
  return (
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={actionsRow}>
      <View style={styles.container}>
        <PresetView {...presetProps} />
        {location && (
          <>
            <Divider />
            <LocationView {...location} />
          </>
        )}
      </View>
      {isTrack ? (
        notesComponent
      ) : (
        <DescriptionField notes={notes} updateNotes={updateNotes} />
      )}
      <MediaScrollView photos={photos} />
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
});
