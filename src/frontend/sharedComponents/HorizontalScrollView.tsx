import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

type HorizontalMediaScrollViewProps = {
  renderChildren: (itemWidth: number) => React.ReactNode;
  numberOfItems: number;
  minItemWidth: number;
  gap: number;
  shouldShowLastItems: boolean;
};

export const HorizontalScrollView = ({
  minItemWidth,
  gap,
  renderChildren,
  numberOfItems,
  shouldShowLastItems,
}: HorizontalMediaScrollViewProps) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(
    null,
  );

  useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current && shouldShowLastItems) {
        scrollViewRef.current.scrollToEnd();
      }
    }, [shouldShowLastItems]),
  );

  const itemWidth = !containerWidth
    ? minItemWidth
    : calculateThumbnailSize({
        minItemWidth,
        gap,
        containerSize: containerWidth,
      });

  return (
    <ScrollView
      ref={scrollViewRef}
      onLayout={event => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
      horizontal
      scrollEnabled={
        !containerWidth ? false : itemWidth * numberOfItems > containerWidth
      }
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap}}
      contentInset={{top: 5, right: 5, bottom: 5, left: 5}}
      style={styles.mediaContainer}>
      {renderChildren(itemWidth)}
    </ScrollView>
  );
};

function calculateThumbnailSize({
  minItemWidth,
  gap,
  containerSize,
}: {
  minItemWidth: number;
  gap: number;
  containerSize: number;
}) {
  // The total space per thumbnail including gap
  const minSpacePerThumbnail = minItemWidth + gap;

  // Number of full thumbnails that can fit before half thumbnail (minus one gap)
  const maxFullThumbnails = Math.floor(
    containerSize / minSpacePerThumbnail - 0.5,
  );

  // Total number of thumbnails including the half one
  const totalThumbnails = maxFullThumbnails + 0.5;

  // Calculate width of each thumbnail so that (w + gap) * totalThumbnails fits in windowWidth
  return (containerSize - gap * totalThumbnails) / totalThumbnails;
}

const styles = StyleSheet.create({
  mediaContainer: {
    margin: 10,
  },
});
