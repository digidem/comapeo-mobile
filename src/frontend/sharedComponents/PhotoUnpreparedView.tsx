import * as React from 'react';
import {StyleSheet, Image, Pressable} from 'react-native';

import {AlertIcon} from './icons';
import type {ViewStyleProp} from '../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {BLACK, WHITE} from '../lib/styles.ts';

type Props = {
  style?: ViewStyleProp;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  onPress?: () => void;
  attachmentUrl?: string;
  isError?: boolean;
  isPending?: boolean;
};

const PhotoUnpreparedComponent = ({
  resizeMode = 'contain',
  style,
  onPress,
  attachmentUrl,
  isError,
  isPending,
}: Props & {
  attachmentUrl?: string;
  isError?: boolean;
  isPending?: boolean;
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      {isPending ? (
        <UIActivityIndicator color={WHITE} />
      ) : isError || !attachmentUrl ? (
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
