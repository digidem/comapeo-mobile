import {MarkerView} from '@rnmapbox/maps';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useCurrentTrackStore} from '../../hooks/tracks/useCurrentTrackStore';
import {useTrackTimerContext} from '../../contexts/TrackTimerContext';
import {useSharedLocationContext} from '../../contexts/SharedLocationContext';

export const UserTooltipMarker = () => {
  const {timer} = useTrackTimerContext();
  const {locationState} = useSharedLocationContext();
  const totalDistance = useCurrentTrackStore(state => state.distance);

  return (
    locationState.location?.coords && (
      <MarkerView
        id="locationView"
        coordinate={[
          locationState.location.coords.longitude,
          locationState.location.coords.latitude,
        ]}
        anchor={{x: 0.5, y: 1}}>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <View>
              <Text style={styles.text}>{totalDistance.toFixed(2)}km</Text>
            </View>
            <View style={styles.separator} />
            <View>
              <Text style={styles.text}>{timer}</Text>
            </View>
            <View style={styles.indicator} />
          </View>
          <View style={styles.arrow} />
        </View>
      </MarkerView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  wrapper: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    color: '#333333',
  },
  separator: {
    marginLeft: 10,
    marginRight: 10,
    height: 12,
    borderColor: '#CCCCD6',
    borderLeftWidth: 1,
    color: '#CCCCD6',
  },
  indicator: {
    marginLeft: 5,
    height: 10,
    width: 10,
    borderRadius: 99,
    backgroundColor: '#59A553',
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 15,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopColor: '#FFF',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
