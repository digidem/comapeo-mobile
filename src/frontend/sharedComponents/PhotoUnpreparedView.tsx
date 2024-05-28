import * as React from 'react';
import {StyleSheet, Image, ActivityIndicator, Pressable} from 'react-native';

import {AlertIcon} from './icons';
import type {PhotoVariant, ViewStyleProp} from '../sharedTypes';
import {useAttachmentUrlQuery} from '../hooks/server/media';
import {useObservation} from '../hooks/server/observations.ts';

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
    isLoading: observationLoading,
  } = useObservation(observationId);
  const {
    data: attachmentUrl,
    isError: attachmentError,
    isLoading: attachmentUrlLoading,
  } = useAttachmentUrlQuery(
    observation.attachments.find(
      attachment => attachment.driveDiscoveryId === attachmentId,
    )!,
    variant,
  );
  const isLoading = observationLoading || attachmentUrlLoading;
  const isError = observationError || attachmentError;

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <AlertIcon />
      ) : (
        <Image
          // @ts-ignore
          src={attachmentUrl?.url}
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
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
});
