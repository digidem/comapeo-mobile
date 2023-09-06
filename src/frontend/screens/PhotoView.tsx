// This screen will be replaced my the photo modal and is just being used as a proof of concept to show that photo URI is being saved
import React, {useState} from 'react';
import {View, StyleSheet, Image, StyleProp, ViewStyle} from 'react-native';
import {NativeNavigationScreenWithProps} from '../sharedTypes';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  navTitle: {
    id: 'screens.photoview.navTitle',
    defaultMessage: 'Photo View',
  },
});

type Props = {
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
};

export const PhotoView: NativeNavigationScreenWithProps<'PhotoView', Props> = ({
  resizeMode = 'contain',
  style,
  route,
}) => {
  const [error, setError] = useState();
  return (
    <View style={[styles.container, style]}>
      <Image
        onError={({nativeEvent: {error}}) => setError(error)}
        source={{uri: route.params.uri}}
        style={styles.image}
        resizeMethod="scale"
        resizeMode={resizeMode}
      />
    </View>
  );
};

PhotoView.navTitle = m.navTitle;

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
