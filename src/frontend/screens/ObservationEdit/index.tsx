import * as React from 'react';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
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
  isAudioAttachment,
  isDraftPhoto,
  isSavedPhoto,
  isUnprocessedDraftPhoto,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import {
  SavedPhotoThumbnailImage,
  ThumbnailImage,
} from '../../sharedComponents/Thumbnails/PhotoThumbnail';
import {COMAPEO_BLUE, DARK_GREY, LIGHT_GREY, WHITE} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {DateDistance} from '../../sharedComponents/DateDistance';
import PlayArrow from '../../images/PlayArrow.svg';
import {AudioSavedThumbnail} from '../../sharedComponents/Thumbnails/AudioSavedThumbnail';
import {HeaderLeft} from './HeaderLeft';
import {ObservationEditSaveButton} from './ObservationEditSaveButton';

const m = defineMessages({
  observation: {
    id: 'screens.ObservationEdit.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
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
  const {usePreset} = useDraftObservation();
  const preset = usePreset();

  const attachments = usePersistedDraftObservation(store => store.attachments);
  const notes = usePersistedDraftObservation(store => store.value?.tags.notes);

  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {updateTags} = useDraftObservation();

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
          updateTags('notes', newVal);
        }}
      />
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
                      accessibilityLabel="View draft photo."
                      size={size}
                      onPress={() =>
                        navigation.navigate('DraftPhotoPreviewModal', {
                          photo: att,
                        })
                      }>
                      <ThumbnailImage uri={att.thumbnailUri} />
                    </ThumbnailContainer>
                  );
                }
                // observationId must exist if there is a saved photo
                if (isSavedPhoto(att) && observationId) {
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
                        navigation.navigate('AudioDraftPlaybackScreen', {
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
