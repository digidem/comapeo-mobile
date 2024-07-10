import React, {type ComponentProps, useState} from 'react';
import {FlatList} from 'react-native';

/**
 * There seems to be a bug for horizontal scrollable components in the case where the content
 * is not wide enough to make it scrollable. Attempting to scroll in this case
 * causes the content to "jump" instead of scroll.
 *
 * This component is just a wrapper for FlatList when reasonable horizontal behavior is desired.
 */
export function HorizontalFlatList<Item>(
  props: Omit<
    ComponentProps<typeof FlatList<Item>>,
    'horizontal' | 'scrollEnabled' | 'onLayout' | 'onContentSizeChange'
  >,
) {
  const {scrollEnabled, handleContentSizeChange, handleLayout} =
    useFixHorizontalScroll();

  return (
    <FlatList
      {...props}
      horizontal
      scrollEnabled={scrollEnabled}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
    />
  );
}

function useFixHorizontalScroll(): {
  scrollEnabled: boolean;
  handleLayout: ComponentProps<typeof FlatList<unknown>>['onLayout'];
  handleContentSizeChange: ComponentProps<
    typeof FlatList<unknown>
  >['onContentSizeChange'];
} {
  const [scrollViewWidth, setScrollViewWidth] = useState<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  return {
    scrollEnabled,
    handleLayout: ({nativeEvent: {layout}}) => {
      setScrollViewWidth(layout.width);
    },
    handleContentSizeChange: width => {
      if (scrollViewWidth === null) return;
      setScrollEnabled(width >= scrollViewWidth);
    },
  };
}
