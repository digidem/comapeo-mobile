import * as React from 'react';
import {StyleSheet, Image, Pressable} from 'react-native';

import {AlertIcon} from './icons';
import type {PhotoVariant, ViewStyleProp} from '../sharedTypes';
import {useAttachmentUrlQuery} from '../hooks/server/media';
import {useObservation} from '../hooks/server/observations.ts';
import {UIActivityIndicator} from 'react-native-indicators';
import {BLACK, WHITE} from '../lib/styles.ts';

type Props = {
  observationId: string;
  attachmentId: string;
  variant: PhotoVariant;
  style?: ViewStyleProp;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  onPress?: () => void;
};

const PhotoUnpreparedComponent = ({
  observationId,
  attachmentId,
  variant,
  resizeMode = 'contain',
  style,
  onPress,
}: Props) => {
  const {
    data: observation,
    isError: observationError,
    isPending: observationPending,
  } = useObservation(observationId);
  const {
    data: attachmentUrl,
    isError: attachmentError,
    isPending: attachmentUrlPending,
  } = useAttachmentUrlQuery(
    observation.attachments.find(
      attachment => attachment.driveDiscoveryId === attachmentId,
    )!,
    variant,
    !observationPending,
  );
  const isLoading = observationPending || attachmentUrlPending;
  const isError = observationError || attachmentError;

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      {isLoading || !attachmentUrl ? (
        <UIActivityIndicator color={WHITE} />
      ) : isError ? (
        <AlertIcon size={96} />
      ) : (
        <Image
          src={attachmentUrl.url}
          style={styles.image}
          resizeMethod="scale"
          resizeMode={resizeMode}
        />
      )}
    </Pressable>
  );
};

export const PhotoUnpreparedView = React.memo<Props>(PhotoUnpreparedComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BLACK,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
});
