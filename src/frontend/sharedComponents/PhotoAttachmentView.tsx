import * as React from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';

import {AlertIcon} from './icons';
import type {Attachment, PhotoVariant, ViewStyleProp} from '../sharedTypes';
import {useAttachmentUrlQuery} from '../hooks/server/media';

type Props = {
  attachment: Attachment;
  variant: PhotoVariant;
  style?: ViewStyleProp;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
};

const PhotoViewComponent = ({
  attachment,
  variant,
  resizeMode = 'contain',
  style,
}: Props) => {
  const {data, isLoading, isError} = useAttachmentUrlQuery(attachment, variant);
  return (
    <View style={[styles.container, style]}>
      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <AlertIcon />
      ) : (
        <Image
          // @ts-ignore
          source={data}
          style={styles.image}
          resizeMethod="scale"
          resizeMode={resizeMode}
        />
      )}
    </View>
  );
};

export const PhotoAttachmentView = React.memo<Props>(PhotoViewComponent);

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
