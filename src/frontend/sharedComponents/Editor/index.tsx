import * as React from 'react';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {DescriptionField} from './DescriptionField';
import {MediaScrollView} from '../MediaScrollView';
import {PresetAndLocationView} from './PresetAndLocationView';
import {ScreenContentWithDock} from '../ScreenContentWithDock';

type EditorProps = {
  presetName: string;
  onPressPreset?: () => void;
  PresetIcon: React.ReactNode;
  notes: string;
  updateNotes: (newNotes: string) => void;
  photos: (Partial<Photo> | undefined)[];
  location?: {
    lat: number | undefined;
    lon: number | undefined;
    accuracy: number | undefined;
  };
  actionsRow?: React.ReactNode;
};

export const Editor = ({
  presetName,
  onPressPreset,
  PresetIcon,
  notes,
  updateNotes,
  photos,
  location,
  actionsRow,
}: EditorProps) => {
  return (
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={actionsRow}>
      <PresetAndLocationView
        onPressPreset={onPressPreset}
        presetName={presetName}
        PresetIcon={PresetIcon}
        location={location}
      />
      <DescriptionField notes={notes} updateNotes={updateNotes} />
      <MediaScrollView photos={photos} />
    </ScreenContentWithDock>
  );
};
