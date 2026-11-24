import {useFocusEffect} from '@react-navigation/native';
import {type ReactNode, useCallback, useRef, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {calculateItemWidthForScrollView} from '../lib/calculateItemWidthForScrollView';
import {ViewStyleProp} from '../sharedTypes';

type HorizontalMediaScrollViewProps = {
  renderChildren: (itemWidth: number) => ReactNode;
  minItemWidth: number;
  gap: number;
  shouldShowLastItems: boolean;
  containerStyle?: ViewStyleProp;
};

export const HorizontalScrollView = ({
  minItemWidth,
  gap,
  renderChildren,
  shouldShowLastItems,
  containerStyle,
}: HorizontalMediaScrollViewProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
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
      style={[styles.mediaContainer, containerStyle]}>
      {renderChildren(itemWidth)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    gap: 10,
  },
});
