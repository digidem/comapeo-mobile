import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import Chevrondown from '../images/chevrondown.svg';
import ChevrondownDefault from '../images/chevrondown-expanded.svg';
import {ViewStyleProp} from '../sharedTypes';

interface AccordianProps {
  title: React.ReactNode;
  innerAccordianDetails: React.ReactNode;
  style?: ViewStyleProp;
}

export function Accordian({
  title,
  innerAccordianDetails,
  style,
}: AccordianProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = expanded ? Chevrondown : ChevrondownDefault;

  return (
    <Animated.View
      layout={LinearTransition.easing(Easing.inOut(Easing.ease)).duration(400)}>
      <Pressable
        onPress={() => {
          setExpanded(prev => !prev);
        }}
        style={[styles.wrapper, styles.elementWrapper, style]}>
        <View style={styles.wrapper}>{title}</View>
        <Icon />
      </Pressable>
      <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
        {expanded && innerAccordianDetails}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementWrapper: {
    justifyContent: 'space-between',
  },
});
