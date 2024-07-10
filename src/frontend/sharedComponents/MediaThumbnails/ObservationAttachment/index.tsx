import React from 'react';
import {Observation} from '@mapeo/schema';
import {useDimensions} from '@react-native-community/hooks';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';

import {Text} from '../../Text';
import {ThumbnailContainer} from '../ThumbnailContainer';
import {PhotoAttachment} from './PhotoAttachment';

const MIN_SIZE = 150;

const m = defineMessages({
  unrecognized: {
    id: 'sharedComponents.MediaThumbnails.ObservationAttachment.unrecognized',
    defaultMessage: 'Unrecognized attachment type',
  },
  cannotDisplay: {
    id: 'sharedComponents.MediaThumbnails.ObservationAttachment.cannotDisplay',
    defaultMessage: 'Cannot display {attachmentType}',
  },
  unknown: {
    id: 'sharedComponents.MediaThumbnails.ObservationAttachment.unknown',
    defaultMessage: 'Unknown attachment type: {attachmentType}',
  },
});

export function ObservationAttachment({
  attachment,
  onPress,
}: {
  attachment: Observation['attachments'][number];
  onPress?: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const {window} = useDimensions();

  const size = Math.max(MIN_SIZE, window.width * 0.25);

  switch (attachment.type) {
    case 'UNRECOGNIZED': {
      return (
        <ThumbnailContainer size={size} style={styles.placeholder}>
          <Text>{t(m.unrecognized)}</Text>
        </ThumbnailContainer>
      );
    }
    case 'audio':
    case 'video': {
      return (
        <ThumbnailContainer size={size} style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {t(m.cannotDisplay, {attachmentType: attachment.type})}
          </Text>
        </ThumbnailContainer>
      );
    }
    case 'photo': {
      return (
        <PhotoAttachment
          driveId={attachment.driveDiscoveryId}
          name={attachment.name}
          size={size}
          onPress={onPress}
        />
      );
    }
    // Accounts for valid attachment types that this device may be unfamiliar with due to syncing data from others with a different schema
    default: {
      return (
        <ThumbnailContainer size={size} style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {t(m.unknown, {attachmentType: attachment.type})}
          </Text>
        </ThumbnailContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  placeholder: {
    padding: 8,
  },
  placeholderText: {
    textAlign: 'center',
  },
});
