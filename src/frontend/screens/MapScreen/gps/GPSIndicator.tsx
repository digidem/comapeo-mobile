import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../sharedComponents/Text';
import NoGPSSignalImage from '../../../images/NoGPSSignal.svg';
import ActiveGPSSignalImage from '../../../images/ActiveGPSSignal.svg';
import * as Location from 'expo-location';

export const GPSIndicator = () => {
  const [backgroundStatus] = Location.useBackgroundPermissions();
  const [foregroundStatus] = Location.useForegroundPermissions();

  return (
    <View style={styles.indicatorWrapper}>
      <View style={styles.wrapper}>
        {backgroundStatus?.granted && foregroundStatus?.granted ? (
          <>
            <ActiveGPSSignalImage width={12} height={12} />
            <Text style={styles.text}>GPS</Text>
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
    position: 'absolute',
    padding: 14.5,
    top: 20,
  },
  wrapper: {flexDirection: 'row', alignItems: 'center'},
  text: {marginLeft: 5, color: '#fff', fontSize: 15},
});
