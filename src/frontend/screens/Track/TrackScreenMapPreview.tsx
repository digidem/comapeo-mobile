import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {MAP_STYLE} from '../MapScreen';
import {DisplayedTrackPathLayer} from '../MapScreen/track/DisplayedTrackPathLayer.tsx';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import CheapRuler from 'cheap-ruler';

interface TrackScreenMapPreview {
  locationHistory: LocationHistoryPoint[];
  coords: number[];
}

const slope = -0.044;
const baseZoom = 16;

export const TrackScreenMapPreview: FC<TrackScreenMapPreview> = ({
  coords,
  locationHistory,
}) => {
  const ruler = new CheapRuler(locationHistory[0]!.latitude);
  const distance = ruler.lineDistance(
    locationHistory.map(point => [point.longitude, point.latitude]),
  );
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
        zoomLevel={slope * distance + baseZoom + Math.abs(slope)}
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
