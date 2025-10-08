import * as React from 'react';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
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
import {
  isDraftPhoto,
  isUnprocessedDraftPhoto,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import {ThumbnailImage} from '../../sharedComponents/Thumbnails/PhotoThumbnail';
import {COMAPEO_BLUE, DARK_GREY, LIGHT_GREY, WHITE} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {DateDistance} from '../../sharedComponents/DateDistance';
import PlayArrow from '../../images/PlayArrow.svg';
import {LiveLocationView} from './LiveLocationView';

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
  const {usePreset} = useDraftObservation();
  const preset = usePreset();

  const attachments = usePersistedDraftObservation(store => store.attachments);
  const notes = usePersistedDraftObservation(store => store.value?.tags.notes);
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {updateTags} = useDraftObservation();

  const presetName = preset
    ? formatMessage({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : formatMessage(m.observation);

  return (
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={<ActionsRow />}>
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
        <PresetView
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
      headerRight: () => <ObservationCreateSaveButton />,
      headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
    };
  };
}
