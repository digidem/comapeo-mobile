import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../sharedComponents/Text';
import NoGPSSignalImage from '../../../images/NoGPSSignal.svg';
import ActiveGPSSignalImage from '../../../images/ActiveGPSSignal.svg';
import * as Location from 'expo-location';
import {useLocation} from '../../../hooks/useLocation';

export const GPSIndicator = () => {
  const {location} = useLocation({maxDistanceInterval: 15});
  const [backgroundStatus] = Location.useBackgroundPermissions();
  const [foregroundStatus] = Location.useForegroundPermissions();

  return (
    <View style={styles.indicatorWrapper}>
      <View style={styles.wrapper}>
        {backgroundStatus?.granted && foregroundStatus?.granted ? (
          <>
            <ActiveGPSSignalImage width={12} height={12} />
            <Text style={styles.text}>
              GPS ± {Math.floor(location?.coords.accuracy || 0)}
            </Text>
          </>
        ) : (
          <>
            <NoGPSSignalImage width={12} height={12} />
            <Text style={styles.text}>No GPS</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorWrapper: {
    backgroundColor: '#333333',
    borderRadius: 20,
    padding: 14.5,
  },
  wrapper: {flexDirection: 'row', alignItems: 'center'},
  text: {marginLeft: 5, color: '#fff', fontSize: 15},
});
