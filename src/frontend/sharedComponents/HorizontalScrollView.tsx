import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {calculateItemWidthForScrollView} from '../lib/calculateItemWidthForScrollView';

type HorizontalMediaScrollViewProps = {
  renderChildren: (itemWidth: number) => React.ReactNode;
  minItemWidth: number;
  gap: number;
  shouldShowLastItems: boolean;
};

export const HorizontalScrollView = ({
  minItemWidth,
  gap,
  renderChildren,
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
    : calculateItemWidthForScrollView({
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
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap}}
      contentInset={{top: 5, right: 5, bottom: 5, left: 5}}
      style={styles.mediaContainer}>
      {renderChildren(itemWidth)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    margin: 10,
  },
});
