import * as React from 'react';
import Mapbox, {UserLocation} from '@rnmapbox/maps';
import config from '../../../config.json';
import CheapRuler from 'cheap-ruler';
import {IconButton} from '../IconButton';
import {LocationFollowingIcon, LocationNoFollowIcon} from '../icons';
import {View, StyleSheet} from 'react-native';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

const ruler = new CheapRuler(0, 'meters');

Mapbox.setAccessToken(config.mapboxAccessToken);
const MIN_DISPLACEMENT = 15;

type MapViewProps = {
  coords?: number[];
  isFocused: boolean;
  locationServiceEnabled?: boolean;
};

const MAP_STYLE = Mapbox.StyleURL.Outdoors;

type Props = {
  // observations: ObservationsMap;
  styleURL: string;
  isOfflineFallback: boolean;
  // location: LocationContextType;
  onPressObservation: (observationId: string) => any;
  isFocused: boolean;
};
type Coords = number[];

export const MapView = React.memo(
  ({coords, locationServiceEnabled, isFocused}: MapViewProps) => {
    const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
    const [following, setFollowing] = React.useState(false);

    React.useEffect(() => {
      Mapbox.setTelemetryEnabled(false);
    }, []);

    return (
      <React.Fragment>
        <Mapbox.MapView
          testID="mapboxMapView"
          style={{flex: 1}}
          logoEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          surfaceView={true}
          attributionPosition={{right: 8, bottom: 8}}
          compassEnabled={false}
          styleURL={MAP_STYLE}>
          <Mapbox.Camera
            defaultSettings={{
              centerCoordinate: coords,
              zoomLevel: zoom,
            }}
            centerCoordinate={following ? coords : undefined}
            // zoomLevel={zoom}
            animationDuration={1000}
            animationMode="flyTo"
            followUserLocation={false}
          />
          {locationServiceEnabled ? (
            <UserLocation
              visible={isFocused}
              minDisplacement={MIN_DISPLACEMENT}
            />
          ) : null}
        </Mapbox.MapView>
        <View style={styles.locationButton}>
          <IconButton onPress={() => setFollowing(prev => !prev)}>
            {following ? <LocationFollowingIcon /> : <LocationNoFollowIcon />}
          </IconButton>
        </View>
      </React.Fragment>
    );
  },
  shouldComponentSkipRerender,
);

function shouldComponentSkipRerender(
  prevProps: MapViewProps,
  nextProps: MapViewProps,
) {
  if (!nextProps.isFocused) return true;

  if (prevProps.locationServiceEnabled !== nextProps.locationServiceEnabled)
    return false;

  if (!nextProps.coords) return true;

  if (!prevProps.coords) return false;

  const distanceMoved = ruler.distance(
    [prevProps.coords[0], prevProps.coords[1]],
    [nextProps.coords[0], nextProps.coords[1]],
  );

  if (distanceMoved < MIN_DISPLACEMENT) return true;

  return false;
}

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});
