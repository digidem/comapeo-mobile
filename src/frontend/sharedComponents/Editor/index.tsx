import * as React from 'react';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {Audio} from '../../sharedTypes/audio';
import {DescriptionField} from './DescriptionField';
import {ScreenContentWithDock} from '../ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {COMAPEO_BLUE, DARK_GREY, LIGHT_GREY, WHITE} from '../../lib/styles';
import {PresetView} from './PresetView';
import {LocationView} from './LocationView';
import {Divider} from '../Divider';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../Text/HeaderText';
import {HorizontalScrollView} from '../HorizontalScrollView';
import {
  isAudioAttachment,
  isDraftPhoto,
  isSavedPhoto,
  isUnprocessedDraftPhoto,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import {
  GAP,
  MIN_WIDTH,
  ThumbnailContainer,
  ThumbnailLoader,
} from '../Thumbnails/ThumbnailContainer';
import {
  SavedPhotoThumbnailImage,
  ThumbnailImage,
} from '../Thumbnails/PhotoThumbnail';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {AudioSavedThumbnail} from '../Thumbnails/AudioSavedThumbnail';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import PlayArrow from '../../images/PlayArrow.svg';
import {BodyText} from '../Text/BodyText';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {DateDistance} from '../DateDistance';
import {TrackStats} from './TrackStats';

type EditorProps = {
  presetName: string;
  onPressPreset?: () => void;
  PresetIcon: React.ReactNode;
  notes?: string;
  updateNotes?: (newNotes: string) => void;
  attachments?: (Audio | Photo)[];
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
  attachments,
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
  const {navigate} = useNavigationFromRoot();
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );

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
            {projectDetails.role === 'solo'
              ? projectDetails.projectHeader
              : projectDetails.projectName}
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
      {attachments && attachments.length > 0 && (
        <HorizontalScrollView
          shouldShowLastItems={true}
          minItemWidth={MIN_WIDTH}
          gap={GAP}
          renderChildren={size => (
            <>
              {attachments.map(att => {
                if (isUnprocessedDraftPhoto(att)) {
                  return <ThumbnailLoader size={size} key={att.draftPhotoId} />;
                }
                if (isDraftPhoto(att)) {
                  return (
                    <ThumbnailContainer
                      key={att.draftPhotoId}
                      size={size}
                      onPress={() =>
                        navigate('PhotoPreviewModal', {
                          photo: att,
                          // TODO: Does it make sense to provide the `observationDocId` in this case?
                          // Reasoning for not doing so is because the photo isn't actually saved yet, so it's technically not
                          // officially associated with the observation being created/edited.
                          // TODO: Is this considered validated yet?
                        })
                      }>
                      <ThumbnailImage uri={att.thumbnailUri} />
                    </ThumbnailContainer>
                  );
                }
                if (isSavedPhoto(att)) {
                  return (
                    <React.Suspense
                      key={att.driveDiscoveryId + att.hash + att.type}
                      fallback={<ThumbnailLoader size={size} />}>
                      <SavedPhotoThumbnailImage
                        size={size}
                        photo={att}
                        onPress={() => {
                          navigate('PhotoPreviewModal', {
                            photo: att,
                            observationDocId: observationId,
                          });
                        }}
                      />
                    </React.Suspense>
                  );
                }

                if (isAudioAttachment(att) && observationId) {
                  return (
                    <AudioSavedThumbnail
                      size={size}
                      key={att.driveDiscoveryId + att.hash + att.type}
                      audio={att}
                      observationId={observationId}
                    />
                  );
                }
                if (isUnsavedAudio(att)) {
                  return (
                    <ThumbnailContainer
                      key={att.uri}
                      size={size}
                      onPress={() =>
                        navigate('AudioDraftPlaybackScreen', {
                          uri: att.uri,
                          createdAt: att.createdAt,
                          showRecordingSavedText: false,
                        })
                      }
                      containerStyle={{
                        backgroundColor: WHITE,
                        borderColor: COMAPEO_BLUE,
                        borderWidth: 2,
                        paddingVertical: 8,
                      }}
                      accessibilityLabel="Play audio recording.">
                      <PlayArrow width={48} height={48} />
                      <BodyText variant="tinyMeta" style={{fontWeight: '500'}}>
                        {millisecondsToMMSS(att.duration)}
                      </BodyText>
                      <DateDistance
                        date={new Date(att.createdAt)}
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          color: DARK_GREY,
                        }}
                      />
                    </ThumbnailContainer>
                  );
                }
              })}
            </>
          )}
        />
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
