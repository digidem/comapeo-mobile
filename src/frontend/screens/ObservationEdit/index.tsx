import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {ActionsRow} from '../../sharedComponents/ActionsRow';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {PresetView} from '../../sharedComponents/PresetView';
import {DescriptionField} from '../../sharedComponents/DescriptionField';
import {HorizontalScrollView} from '../../sharedComponents/HorizontalScrollView';
import {
  GAP,
  MIN_WIDTH,
  ThumbnailContainer,
  ThumbnailLoader,
} from '../../sharedComponents/Thumbnails/ThumbnailContainer';
import {
  SavedPhotoThumbnailImage,
  ThumbnailImage,
} from '../../sharedComponents/Thumbnails/PhotoThumbnail';
import {COMAPEO_BLUE, DARK_GREY, LIGHT_GREY, WHITE} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {DateDistance} from '../../sharedComponents/DateDistance';
import PlayArrow from '../../images/PlayArrow.svg';
import {HeaderLeft} from './HeaderLeft';
import {ObservationEditSaveButton} from './ObservationEditSaveButton';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';
import {
  isUnsavedAudioAttachment,
  isUnsavedPhotoAttachment,
} from '../../lib/attachmentTypeChecks';

const m = defineMessages({
  observation: {
    id: 'screens.ObservationEdit.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
  // primary-string
  navTitle: {
    id: 'screens.ObservationEdit.navTitle',
    defaultMessage: 'Edit Observation',
    description: 'screen title for edit observation screen',
  },
  changePreset: {
    id: 'screens.ObservationEdit.changePreset',
    defaultMessage: 'Change',
  },
  descriptionPlaceholder: {
    id: 'screens.ObservationEdit.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const ObservationEdit = ({
  navigation,
}: NativeRootNavigationProps<'ObservationEdit'>) => {
  const {formatMessage} = useIntl();
  const observationId = useDraftObservationState(store => store.id);
  const observation = useDraftObservationState(store => store.value);
  const notes = observation?.tags.notes;
  const preset = observation?.presetRef;
  const savedAttachments = observation?.attachments;
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {updateTag} = useDraftObservationActions();
  const attachments = useDraftObservationState(
    store => store.unsavedAttachments,
  );

  const presetName = preset ? preset.name : formatMessage(m.observation);

  return (
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={<ActionsRow fieldRefs={preset?.fieldRefs} />}>
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
        <PresetView
          onPressPreset={() =>
            navigation.navigate('ObservationCategoryChooser')
          }
          PresetIcon={
            <PresetCircleIcon
              size="medium"
              iconId={preset?.iconRef?.docId}
              testID={`OBS.${preset?.name}-icon`}
              color={preset?.color}
            />
          }
          presetName={presetName}
        />
      </View>
      <DescriptionField
        notes={typeof notes !== 'string' ? '' : notes}
        updateNotes={newVal => {
          updateTag('notes', newVal);
        }}
      />
      {(savedAttachments || attachments) && (
        <HorizontalScrollView
          shouldShowLastItems={true}
          minItemWidth={MIN_WIDTH}
          gap={GAP}
          renderChildren={size => (
            <>
              {savedAttachments &&
                savedAttachments.map(att => {
                  if (observationId && att.type === 'photo') {
                    return (
                      <React.Suspense
                        key={att.driveDiscoveryId + att.hash + att.type}
                        fallback={<ThumbnailLoader size={size} />}>
                        <SavedPhotoThumbnailImage
                          size={size}
                          photo={att}
                          onPress={() => {
                            navigation.navigate('AttachedPhotoPreviewModal', {
                              photo: att,
                              observationDocId: observationId.docId,
                            });
                          }}
                        />
                      </React.Suspense>
                    );
                  }

                  if (att.type === 'audio' && observationId) {
                    return (
                      <ThumbnailContainer
                        key={att.hash}
                        size={size}
                        onPress={() =>
                          navigation.navigate('AudioAttachmentPlaybackScreen', {
                            driveDiscoveryId: att.driveDiscoveryId,
                            name: att.name,
                            type: 'audio',
                            createdAt: att.createdAt,
                          })
                        }
                        containerStyle={styles.container}
                        accessibilityLabel="Play audio recording.">
                        <PlayArrow width={48} height={48} />
                        {att.createdAt && (
                          <DateDistance
                            date={new Date(att.createdAt)}
                            style={{
                              fontSize: 12,
                              fontWeight: 400,
                              color: DARK_GREY,
                            }}
                          />
                        )}
                      </ThumbnailContainer>
                    );
                  }
                })}
              {attachments &&
                attachments.map(att => {
                  if (isUnsavedPhotoAttachment(att)) {
                    // if the original and thumbnail are not ready, show loader
                    if (
                      att.original.processingState !== 'complete' ||
                      att.thumbnail.processingState !== 'complete'
                    ) {
                      return <ThumbnailLoader size={size} key={att.id} />;
                    } else {
                      return (
                        <ThumbnailContainer
                          key={att.id}
                          accessibilityLabel="View draft photo."
                          size={size}
                          onPress={() =>
                            navigation.navigate('DraftPhotoPreviewModal', {
                              photoId: att.id,
                              photoExif: att.photoExif,
                              // We check for null above, so here it is safe to assert non-null
                              uri: att.original.uri!,
                              photoMetadata: {
                                timestamp: att.timestamp,
                                location: att.location,
                                accelerometer: att.accelerometer,
                              },
                            })
                          }>
                          <ThumbnailImage uri={att.thumbnail.uri} />
                        </ThumbnailContainer>
                      );
                    }
                  }

                  if (
                    isUnsavedAudioAttachment(att) &&
                    att.original.uri !== null
                  ) {
                    return (
                      <ThumbnailContainer
                        key={att.id}
                        size={size}
                        onPress={() =>
                          navigation.navigate('AudioDraftPlaybackScreen', {
                            uri: att.original.uri!,
                            audioId: att.id,
                            createdAt: att.timestamp,
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
                        <BodyText
                          variant="tinyMeta"
                          style={{fontWeight: '500'}}>
                          {millisecondsToMMSS(att.duration)}
                        </BodyText>
                        <DateDistance
                          date={new Date(att.timestamp)}
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

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.navTitle),
      headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
      headerRight: () => <ObservationEditSaveButton />,
    };
  };
}
