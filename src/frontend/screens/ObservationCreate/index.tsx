import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {HeaderLeft} from './HeaderLeft';
import {ActionsRow} from '../../sharedComponents/ActionsRow';
import {ObservationCreateSaveButton} from './ObservationCreateSaveButton';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {PresetView} from '../../sharedComponents/Editor/PresetView';
import {DescriptionField} from '../../sharedComponents/Editor/DescriptionField';
import {HorizontalScrollView} from '../../sharedComponents/HorizontalScrollView';
import {
  GAP,
  MIN_WIDTH,
  ThumbnailContainer,
  ThumbnailLoader,
} from '../../sharedComponents/Thumbnails/ThumbnailContainer';
import {isUnsavedAudio} from '../../lib/attachmentTypeChecks';
import {ThumbnailImage} from '../../sharedComponents/Thumbnails/PhotoThumbnail';
import {COMAPEO_BLUE, DARK_GREY, LIGHT_GREY, WHITE} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {DateDistance} from '../../sharedComponents/DateDistance';
import PlayArrow from '../../images/PlayArrow.svg';
import {LiveLocationView} from './LiveLocationView';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';
import {
  isUnsavedAudioAttachment,
  isUnsavedPhotoAttachment,
} from '../../lib/attachmentTypeCheckDraftStore';

const m = defineMessages({
  observation: {
    id: 'screens.ObservationCreate.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
  navTitle: {
    id: 'screens.ObservationCreate.navTitle',
    defaultMessage: 'New Observation',
    description: 'screen title for new observation screen',
  },
  changePreset: {
    id: 'screens.ObservationCreate.changePreset',
    defaultMessage: 'Change',
  },
  descriptionPlaceholder: {
    id: 'screens.ObservationCreate.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const ObservationCreate = ({
  navigation,
}: NativeRootNavigationProps<'ObservationCreate'>) => {
  const {formatMessage} = useIntl();
  const preset = useDraftObservationState(state => state.value?.presetRef);

  const attachments = useDraftObservationState(
    store => store.unsavedAttachments,
  );

  const notes = useDraftObservationState(store => store.value?.tags.notes);
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {updateTag} = useDraftObservationActions();

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

        <LiveLocationView />
      </View>
      <DescriptionField
        notes={typeof notes !== 'string' ? '' : notes}
        updateNotes={newVal => {
          updateTag('notes', newVal);
        }}
      />
      {attachments && (
        <HorizontalScrollView
          shouldShowLastItems={true}
          minItemWidth={MIN_WIDTH}
          gap={GAP}
          renderChildren={size => (
            <>
              {[...attachments.entries()].map(([, att]) => {
                if (isUnsavedPhotoAttachment(att)) {
                  // if the preview and thumbnail are not ready, show loader
                  if (
                    att.original.uri === null ||
                    att.preview.processingState !== 'complete' ||
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
                        <ThumbnailImage uri={att.preview.uri} />
                      </ThumbnailContainer>
                    );
                  }
                }

                // if (isUnsavedAudioAttachment(att)) {
                //   return (
                //     <ThumbnailContainer
                //       key={att.id}
                //       size={size}
                //       onPress={() =>
                //         navigation.navigate('AudioDraftPlaybackScreen', {
                //           uri: att.original.uri,
                //           createdAt: att.createdAt,
                //           showRecordingSavedText: false,
                //         })
                //       }
                //       containerStyle={{
                //         backgroundColor: WHITE,
                //         borderColor: COMAPEO_BLUE,
                //         borderWidth: 2,
                //         paddingVertical: 8,
                //       }}
                //       accessibilityLabel="Play audio recording.">
                //       <PlayArrow width={48} height={48} />
                //       <BodyText variant="tinyMeta" style={{fontWeight: '500'}}>
                //         {millisecondsToMMSS(att.duration)}
                //       </BodyText>
                //       <DateDistance
                //         date={new Date(att.createdAt)}
                //         style={{
                //           fontSize: 12,
                //           fontWeight: '400',
                //           color: DARK_GREY,
                //         }}
                //       />
                //     </ThumbnailContainer>
                //   );
                // }
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
      headerRight: () => <ObservationCreateSaveButton />,
      headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
    };
  };
}
