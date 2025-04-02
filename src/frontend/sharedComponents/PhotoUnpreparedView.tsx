import * as React from 'react';
import {StyleSheet, Image, Pressable} from 'react-native';

import {AlertIcon} from './icons';
import type {PhotoVariant, ViewStyleProp} from '../sharedTypes';
import {useAttachmentUrlQuery} from '../hooks/server/media';
import {BLACK} from '../lib/styles.ts';
import {SavedPhoto} from '../contexts/PhotoPromiseContext/types.ts';

type Props = {
  photo: SavedPhoto;
  variant: PhotoVariant;
  style?: ViewStyleProp;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  onPress?: () => void;
};

const PhotoUnpreparedComponent = ({
  photo,
  variant,
  resizeMode = 'contain',
  style,
  onPress,
}: Props) => {
  const {url: attachmentUrl, error} = useAttachmentUrlQuery(photo, variant);

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      {error || !attachmentUrl ? (
        <AlertIcon size={96} />
      ) : (
        <Image
          src={attachmentUrl}
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
