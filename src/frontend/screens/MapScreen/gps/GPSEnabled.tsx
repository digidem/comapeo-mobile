import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';
import {useTracking} from '../../../hooks/tracks/useTracking';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
} from 'react-native-reanimated';

export const GPSEnabled = () => {
  const {isTracking, cancelTracking, startTracking, loading} = useTracking();

  const handleTracking = () => {
    isTracking ? cancelTracking() : startTracking();
  };

  const getButtonTitle = () => {
    if (loading) return 'Loading...';
    if (isTracking) return 'Stop Tracks';
    return 'Start Tracks';
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(550).easing(Easing.elastic(1))}
      exiting={FadeOutDown.delay(100).duration(450).easing(Easing.elastic(1))}
      style={styles.wrapper}>
      <Button fullWidth onPress={handleTracking}>
        <Text style={styles.buttonText} disabled={loading}>
          {getButtonTitle()}
        </Text>
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {paddingHorizontal: 20, paddingVertical: 30},
  buttonText: {fontWeight: '500', color: '#fff'},
});
