import React from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';

const spacing = 10;
const minSize = 150;

type HorizontalMediaScrollViewProps = {
  renderThumbnailChildren: (size: number) => React.ReactNode;
  numberOfAttachments: number;
};

export const HorizontalMediaScrollView = ({
  renderThumbnailChildren,
  numberOfAttachments,
}: HorizontalMediaScrollViewProps) => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useLayoutEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  }, [numberOfAttachments]);

  const windowWidth = Dimensions.get('window').width;
  // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
  // the screen.
  const size =
    windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      scrollEnabled={size * numberOfAttachments > windowWidth}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap: 5}}
      contentInset={{top: 5, right: 5, bottom: 5, left: 5}}
      style={styles.mediaContainer}>
      {renderThumbnailChildren(size)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    margin: 10,
  },
});
