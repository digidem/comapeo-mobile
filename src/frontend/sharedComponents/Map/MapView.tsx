import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import config from '../../../config.json';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

Mapbox.setAccessToken(config.mapboxAccessToken);

type MapViewProps = {
  location: {
    position: {
      coords: [number, number];
      timestamp: number;
    };
    zoom: number;
  };
};

const MAP_STYLE = Mapbox.StyleURL.TrafficNight;

type Props = {
  // observations: ObservationsMap;
  styleURL: string;
  isOfflineFallback: boolean;
  // location: LocationContextType;
  onPressObservation: (observationId: string) => any;
  isFocused: boolean;
};
type Coords = number[];

type State = {
  // True if the map is following user location
  following: boolean;
  hasFinishedLoadingStyle?: boolean;
  zoom: number;
  // lon, lat
  coords: Coords;
};

export const MapView = ({location}: MapViewProps) => {
  const [following, setFollowing] = useState<State['following']>(false);
  /* TODO: infer from location context (?):
    !!props.location.provider &&
                props.location.provider.locationServicesEnabled,
    */
  const [zoom, setZoom] = useState<State['zoom']>(DEFAULT_ZOOM);
  /* TODO: infer from location context (?):
   props.location.provider &&
                props.location.provider.locationServicesEnabled
                    ? DEFAULT_ZOOM_FALLBACK_MAP
                    : 0.1,
   */
  const [coords, setCoords] = useState<Coords>(location.position.coords);

  useEffect(() => {
    Mapbox.setTelemetryEnabled(false);
  }, []);

  const handleLocationPress = () => {};
  const handleRegionWillChange = () => {};
  const handleRegionIsChanging = () => {
    console.log({zoom, coords});
  };

  const handleRegionDidChange = (e: Mapbox.MapState) => {
    // if (!e.gestures.isGestureActive) return;

    console.log({c: e.properties.center});

    setZoom(e.properties.zoom);
    setCoords(e.properties.center);
  };
  const handleDidFinishLoadingStyle = () => {};

  return (
    // <View style={styles.container}>
    <Mapbox.MapView
      testID="mapboxMapView"
      style={{flex: 1}}
      // ref={handleMapViewRef}
      logoEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      surfaceView={true}
      attributionPosition={{right: 8, bottom: 8}}
      compassEnabled={false}
      styleURL={MAP_STYLE}
      onCameraChanged={handleRegionIsChanging}
      onMapIdle={handleRegionDidChange}>
      <Mapbox.Camera
        defaultSettings={{
          centerCoordinate: coords,
          zoomLevel: zoom,
        }}
        centerCoordinate={location.position.coords}
        // zoomLevel={zoom}
        animationDuration={1000}
        animationMode="flyTo"
        followUserLocation={false}
      />
    </Mapbox.MapView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
