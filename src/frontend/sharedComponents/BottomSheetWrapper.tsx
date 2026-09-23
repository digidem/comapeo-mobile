import * as React from 'react';
import {View} from 'react-native';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {WHITE} from '../lib/styles';
import {useNavigation} from '@react-navigation/native';
import {usePreventAndroidBackButton} from '../hooks/usePreventAndroidBackButton';

/**
 *
 * @description A wrapper component that should be used for bottom sheets. It will handle the animation and prevent the back button from closing the bottom sheet.
 *
 * When pushing a bottom sheet ontop of another bottom sheet use `navigation.replace`, to close the original bottom sheet first.
 */
export const BottomSheetWrapper = ({children}: {children: React.ReactNode}) => {
  const navigation = useNavigation();

  const [displayContent, setDisplayContent] = React.useState(true);

  usePreventAndroidBackButton();

  // This effect is used to prevent the bottom sheet from being removed before the animation is complete
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      setDisplayContent(false);
      setTimeout(() => {
        navigation.dispatch(e.data.action);
      }, 140);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}>
      {displayContent && (
        <Animated.View
          style={{
            backgroundColor: WHITE,
            padding: 20,
            paddingTop: 40,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          entering={SlideInDown.duration(150)}
          exiting={SlideOutDown.duration(150)}>
          {children}
        </Animated.View>
      )}
    </View>
  );
};
