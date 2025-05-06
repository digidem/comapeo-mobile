import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {Attachment, ViewStyleProp} from '../../sharedTypes';
import {Observation} from '@comapeo/schema';
import {
  FormattedObservationDate,
  FormattedPresetName,
} from '../../sharedComponents/FormattedData';
import {PhotoAttachmentView} from '../../sharedComponents/PhotoAttachmentView.tsx';
import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {isSavedPhoto} from '../../lib/attachmentTypeChecks.ts';
import {matchPreset} from '../../lib/utils';
import {useIsMyDocument} from '../../hooks/useIsMyDocument.ts';
import {sharedStyles} from './SharedStyle.ts';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';

interface ObservationListItemProps {
  style?: ViewStyleProp;
  observation: Observation;
  testID: string;
  onPress: (id: string) => void;
}

type PhotoAttachment = Omit<Attachment, 'type'> & {type: 'photo'};

const photoOverlap = 10;

export const ObservationListItem = React.memo<ObservationListItemProps>(
  ObservationListItemNotMemoized,
);

function ObservationListItemNotMemoized({
  style,
  observation,
  testID,
  onPress,
}: ObservationListItemProps) {
  const {projectId} = useActiveProject();
  const {data: allPresets} = useManyDocs({projectId, docType: 'preset'});
  const preset = matchPreset(observation.tags, allPresets);

  const photos = observation.attachments.filter(isSavedPhoto);

  const isMine = useIsMyDocument(observation.originalVersionId);

  return (
    <TouchableOpacity
      onPress={() => onPress(observation.docId)}
      testID={testID}
      style={{flex: 1, height: 80}}>
      <View
        style={[
          styles.container,
          style,
          !isMine && sharedStyles.syncedObservation,
        ]}>
        <View style={styles.text}>
          <HeaderText variant="header4">
            <FormattedPresetName preset={preset} />
          </HeaderText>
          <BodyText>
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="relative"
            />
          </BodyText>
        </View>
        {photos.length ? (
          <View style={styles.photoContainer}>
            <PhotoStack photos={photos} />
            <View style={styles.smallIconContainer}>
              <PresetCircleIcon iconId={preset?.iconRef?.docId} size="small" />
            </View>
          </View>
        ) : (
          <PresetCircleIcon
            iconId={preset?.iconRef?.docId}
            size="medium"
            testID={`OBS.${preset?.name}-list-icon`}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

function PhotoStack({photos}: {photos: PhotoAttachment[]}) {
  return (
    <View
      style={{
        width: 60 + (photos.length - 1) * photoOverlap,
        height: 60,
      }}>
      {photos.map((photo, idx) => (
        <PhotoAttachmentView
          key={`${photo.driveDiscoveryId}/${photo.type}/${photo.name}`}
          attachment={photo}
          variant="thumbnail"
          style={[styles.photo, {left: idx * photoOverlap}]}
          resizeMode="cover"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
    height: 80,
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  photoContainer: {
    position: 'relative',
    marginRight: -5,
  },
  photo: {
    borderRadius: 5,
    overflow: 'hidden',
    position: 'absolute',
    width: 60,
    height: 60,
    top: 0,
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
  },
  smallIconContainer: {position: 'absolute', right: -3, bottom: -3},
});
