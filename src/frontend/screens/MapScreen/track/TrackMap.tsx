import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {MAP_STYLE} from '..';
import {DisplayedTrackPathLayer} from './DisplayedTrackPathLayer';
import {LocationHistoryPoint} from '../../../sharedTypes/location';

interface TrackMap {
  locationHistory: LocationHistoryPoint[];
  coords: number[];
}

export const TrackMap: FC<TrackMap> = ({coords, locationHistory}) => {
  return (
    <MapboxGL.MapView
      style={styles.map}
      zoomEnabled={false}
      logoEnabled={false}
      scrollEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      compassEnabled={false}
      scaleBarEnabled={false}
      styleURL={MAP_STYLE}>
      <MapboxGL.Camera
        centerCoordinate={coords}
        zoomLevel={12}
        animationMode="none"
      />
      <DisplayedTrackPathLayer
        onPress={() => {}}
        locationHistory={locationHistory}
      />
    </MapboxGL.MapView>
  );
};

const MAP_HEIGHT = 250;

export const styles = StyleSheet.create({
  map: {
    height: MAP_HEIGHT,
  },
});
