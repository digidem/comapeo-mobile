import * as React from 'react';
import {StyleSheet, Image, Pressable} from 'react-native';

import {AlertIcon} from './icons';
import type {ViewStyleProp} from '../sharedTypes';
import {useAttachmentUrlQuery} from '../hooks/server/media';
import {BLACK} from '../lib/styles.ts';
import {SavedPhoto} from '../contexts/PhotoPromiseContext/types.ts';

type Props = {
  photo: SavedPhoto;
  style?: ViewStyleProp;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  onPress?: () => void;
};

const PhotoUnpreparedComponent = ({
  photo,
  resizeMode = 'contain',
  style,
  onPress,
}: Props) => {
  const {url: originalAttachmentUrl, error: originalError} =
    useAttachmentUrlQuery(photo, 'original');

  const {url: previewAttachmentUrl, error: previewError} =
    useAttachmentUrlQuery(photo, 'preview');

  const [variantToUse, setVariantToUse] = React.useState<
    'original' | 'preview'
  >('original');

  const [cannotLoad, setCannotLoad] = React.useState(false);

  const shouldDisplayErrorState =
    cannotLoad ||
    (variantToUse === 'original' && originalError) ||
    (variantToUse === 'preview' && previewError);

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      {shouldDisplayErrorState ? (
        <AlertIcon size={96} />
      ) : (
        <Image
          src={
            variantToUse === 'original'
              ? originalAttachmentUrl
              : previewAttachmentUrl
          }
          onError={() => {
            // The original may fail to load depending on media sync settings.
            // Attempt to use the preview URL if using the original does not work.
            if (variantToUse === 'original') {
              setVariantToUse('preview');
              return;
            }

            setCannotLoad(true);
          }}
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
