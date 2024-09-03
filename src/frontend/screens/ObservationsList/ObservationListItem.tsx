import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../sharedComponents/Text';

import {TouchableHighlight} from '../../sharedComponents/Touchables';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {Attachment, ViewStyleProp} from '../../sharedTypes';
import {Observation} from '@mapeo/schema';
import {
  FormattedObservationDate,
  FormattedPresetName,
} from '../../sharedComponents/FormattedData';
import {PhotoAttachmentView} from '../../sharedComponents/PhotoAttachmentView.tsx';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {useOriginalVersionIdToDeviceId} from '../../hooks/server/projects.ts';

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
  onPress = () => {},
}: ObservationListItemProps) {
  const {preset} = useObservationWithPreset(observation.docId);
  const {data: deviceInfo, status: deviceInfoQueryStatus} = useDeviceInfo();

  const photos = observation.attachments.filter(
    (attachment): attachment is PhotoAttachment => attachment.type === 'photo',
  );

  const {
    data: createdByDeviceId,
    status: originalVersionIdToDeviceIdQueryStatus,
  } = useOriginalVersionIdToDeviceId(observation.originalVersionId);
  const isMine = createdByDeviceId === deviceInfo?.deviceId;
  const queriesSucceeded =
    deviceInfoQueryStatus === 'success' &&
    originalVersionIdToDeviceIdQueryStatus === 'success';

  return (
    <TouchableHighlight
      onPress={() => onPress(observation.docId)}
      testID={testID}
      style={{flex: 1, height: 80}}>
      <View
        style={[
          styles.container,
          style,
          queriesSucceeded && !isMine && styles.syncedObservation,
        ]}>
        <View style={styles.text}>
          {preset && (
            <Text style={styles.title}>
              <FormattedPresetName preset={preset} />
            </Text>
          )}
          <Text>
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="relative"
            />
          </Text>
        </View>
        {photos.length ? (
          <View style={styles.photoContainer}>
            <PhotoStack photos={photos} />
            <View style={styles.smallIconContainer}>
              <PresetCircleIcon
                presetDocId={preset?.iconRef?.docId}
                size="small"
              />
            </View>
          </View>
        ) : (
          <PresetCircleIcon
            presetDocId={preset?.iconRef?.docId}
            size="medium"
            testID={`OBS.${preset?.name}-list-icon`}
          />
        )}
      </View>
    </TouchableHighlight>
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
  syncedObservation: {
    borderLeftWidth: 5,
    borderLeftColor: '#3C69F6',
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {fontSize: 18, fontWeight: '700', color: 'black'},
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
