import React from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';

const spacing = 10;
const minSize = 150;

interface MediaScrollProps {
  attachmentLength: number;
  children: React.ReactNode;
}

export const MediaScroll = ({attachmentLength, children}: MediaScrollProps) => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useLayoutEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  }, [attachmentLength]);

  const windowWidth = Dimensions.get('window').width;
  // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
  // the screen.
  const size =
    windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      scrollEnabled={size * attachmentLength > windowWidth}
      showsHorizontalScrollIndicator={false}
      contentInset={{top: 5, right: 5, bottom: 5, left: 5}}
      style={styles.mediaContainer}>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    margin: 10,
  },
});
