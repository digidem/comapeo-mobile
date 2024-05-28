import * as React from 'react';
import {StyleSheet, Image, Pressable} from 'react-native';

import type {ViewStyleProp} from '../sharedTypes';

type Props = {
  photoUri: string;
  style?: ViewStyleProp;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  onPress?: () => void;
};

const PhotoPreparedComponent = ({
  photoUri,
  resizeMode = 'contain',
  style,
  onPress,
}: Props) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <Image
        src={photoUri}
        style={styles.image}
        resizeMethod="scale"
        resizeMode={resizeMode}
      />
    </Pressable>
  );
};

export const PhotoPreparedView = React.memo<Props>(PhotoPreparedComponent);

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
