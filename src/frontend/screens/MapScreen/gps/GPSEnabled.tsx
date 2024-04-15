import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';
import {useTracking} from '../../../hooks/tracks/useTracking';
import StartTrackingIcon from '../../../images/StartTracking.svg';
import StopTrackingIcon from '../../../images/StopTracking.svg';

export const GPSEnabled = () => {
  const {isTracking, cancelTracking, startTracking, loading} = useTracking();

  const handleTracking = useCallback(() => {
    isTracking ? cancelTracking() : startTracking();
  }, [cancelTracking, isTracking, startTracking]);

  const getButtonTitle = () => {
    if (loading) return 'Loading...';
    if (isTracking) return 'Stop Tracks';
    return 'Start Tracks';
  };

  return (
    <View style={styles.container}>
      <Button
        fullWidth
        onPress={handleTracking}
        style={{backgroundColor: isTracking ? '#D92222' : '#0066FF'}}>
        <View style={styles.buttonWrapper}>
          {isTracking ? <StopTrackingIcon /> : <StartTrackingIcon />}
          <Text style={styles.buttonText} disabled={loading}>
            {getButtonTitle()}
          </Text>
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 20, paddingVertical: 30},
  buttonWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
    width: '100%',
    flex: 1,
    textAlign: 'center',
  },
});
