import * as React from 'react';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {MediaScrollView} from '../MediaScrollView';
import {ScreenContentWithDock} from '../ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import {Divider} from '../Divider';

type EditorProps = {
  actionsRow?: React.ReactNode;
  // TODO: Ideally there's a way to constrain the locationView, notesView, and presetView so that they require the correct component to be used
  // e.g. presetView={<PresetView ... />} is valid, but presetView={<LocationView ... />} is not
  locationView?: React.ReactElement;
  notesView: React.ReactElement;
  photos?: Photo[];
  presetView: React.ReactElement;
};

export const Editor = ({
  actionsRow,
  photos,
  locationView,
  notesView,
  presetView,
}: EditorProps) => {
  return (
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={actionsRow}>
      <View style={styles.container}>
        {presetView}
        {locationView && <Divider />}
        {locationView}
      </View>
      {notesView}
      {photos !== undefined && <MediaScrollView photos={photos} />}
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
