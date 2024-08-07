import * as React from 'react';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {DescriptionField} from './DescriptionField';
import {MediaScrollView} from '../MediaScrollView';
import {ScreenContentWithDock} from '../ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import {PresetView, PresetViewProps} from './PresetView';
import {LocationView} from './LocationView';
import {Divider} from '../Divider';

type EditorProps = PresetViewProps & {
  notes: string;
  updateNotes: (newNotes: string) => void;
  photos: Photo[];
  location?: {
    lat: number | undefined;
    lon: number | undefined;
    accuracy: number | undefined;
  };
  actionsRow?: React.ReactNode;
};

export const Editor = ({
  notes,
  updateNotes,
  photos,
  location,
  actionsRow,
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
      <DescriptionField notes={notes} updateNotes={updateNotes} />
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
