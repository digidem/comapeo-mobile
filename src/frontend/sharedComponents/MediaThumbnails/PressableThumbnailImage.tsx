import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import {AlertIcon} from '../icons';
import {styles as thumbnailPlaceholderStyles} from './ThumbnailContainer';

export function PressableThumbnailImage({
  onPress,
  size,
  url,
}: {
  onPress?: () => void;
  size: number;
  url: string;
}) {
  const [error, setError] = React.useState(false);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={thumbnailPlaceholderStyles.base}>
        {error ? (
          <AlertIcon size={size / 2} />
        ) : (
          <Image
            width={size}
            height={size}
            onError={() => {
              setError(true);
            }}
            source={{uri: url}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});
