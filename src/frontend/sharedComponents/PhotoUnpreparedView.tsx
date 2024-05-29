import * as React from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';

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
};

const PhotoUnpreparedComponent = ({
  observationId,
  attachmentId,
  variant,
  resizeMode = 'contain',
  style,
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
    <View style={[styles.container, style]}>
      {isLoading ? (
        <ActivityIndicator size="large" />
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
    </View>
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
