import * as React from 'react';
import {DescriptionField} from './DescriptionField';
import {ScreenContentWithDock} from '../ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import {PresetView} from './PresetView';
import {LocationView} from './LocationView';
import {Divider} from '../Divider';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../Text/HeaderText';
import {TrackStats} from './TrackStats';

type EditorProps = {
  presetName: string;
  onPressPreset?: () => void;
  PresetIcon: React.ReactNode;
  notes?: string;
  updateNotes?: (newNotes: string) => void;
  location?: {
    lat: number | undefined;
    lon: number | undefined;
    accuracy: number | undefined;
  };
  actionsRow?: React.ReactNode;
  notesComponent?: React.ReactNode;
  isTrack?: boolean;
  trackDistance?: number;
  trackDurationMs?: number;
  presetDisabled?: boolean;
};

export const Editor = ({
  notes,
  updateNotes,
  location,
  actionsRow,
  notesComponent,
  isTrack = false,
  trackDistance = 0,
  trackDurationMs = 0,
  ...presetProps
}: EditorProps) => {
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);

  return (
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={actionsRow}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: projectDetails.projectColor,
            paddingVertical: 10,
            // without this the parent container border does not properly show
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            paddingHorizontal: 20,
          }}>
          <HeaderText variant="header6">
            {projectDetails.projectHeader}
          </HeaderText>
        </View>
        <PresetView {...presetProps} />
        {isTrack && (
          <>
            <Divider />
            <TrackStats distance={trackDistance} durationMs={trackDurationMs} />
          </>
        )}
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
