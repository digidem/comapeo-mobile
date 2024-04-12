import * as React from 'react';
import Mapbox, {
  LineJoin,
  LineLayer,
  ShapeSource,
  UserLocation,
} from '@rnmapbox/maps';
import config from '../../../config.json';
import {IconButton} from '../../sharedComponents/IconButton';
import {
  LocationFollowingIcon,
  LocationNoFollowIcon,
} from '../../sharedComponents/icons';
import {LineString} from 'geojson';

import {View, StyleSheet} from 'react-native';
import {ObservationMapLayer} from './ObsevationMapLayer';
import {AddButton} from '../../sharedComponents/AddButton';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../hooks/useDraftObservation';
// @ts-ignore
import ScaleBar from 'react-native-scale-bar';
import {getCoords, useLocation} from '../../hooks/useLocation';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
import {useLastKnownLocation} from '../../hooks/useLastSavedLocation';
import {useLocationProviderStatus} from '../../hooks/useLocationProviderStatus';
import {GPSModal} from './gps/GPSModal';
import {
  FullLocationData,
  useTracksStore,
} from '../../hooks/tracks/useTracksStore';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

Mapbox.setAccessToken(config.mapboxAccessToken);
const MIN_DISPLACEMENT = 15;

export const MAP_STYLE = Mapbox.StyleURL.Outdoors;

export const MapScreen = () => {
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);

  const isFocused = useIsFullyFocused();
  const [isFinishedLoading, setIsFinishedLoading] = React.useState(false);
  const [following, setFollowing] = React.useState(true);
  const {newDraft} = useDraftObservation();
  const {navigate} = useNavigationFromHomeTabs();
  const {location} = useLocation({maxDistanceInterval: MIN_DISPLACEMENT});
  const savedLocation = useLastKnownLocation();
  const coords = location && getCoords(location);
  const locationProviderStatus = useLocationProviderStatus();
  const locationServicesEnabled =
    !!locationProviderStatus?.locationServicesEnabled;

  const locationHistory = useTracksStore(state => state.locationHistory);

  const handleAddPress = () => {
    newDraft();
    navigate('PresetChooser');
  };

  React.useEffect(() => {
    Mapbox.setTelemetryEnabled(false);
  }, []);

  function handleLocationPress() {
    setZoom(DEFAULT_ZOOM);
    setFollowing(prev => !prev);
  }

  function handleDidFinishLoadingStyle() {
    setIsFinishedLoading(true);
  }

  return (
    <View style={{flex: 1}}>
      <Mapbox.MapView
        testID="mapboxMapView"
        style={{flex: 1}}
        logoEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        surfaceView={true}
        attributionPosition={{right: 8, bottom: 8}}
        compassEnabled={false}
        scaleBarEnabled={false}
        styleURL={MAP_STYLE}
        onDidFinishLoadingStyle={handleDidFinishLoadingStyle}
        onMoveShouldSetResponder={() => {
          if (following) setFollowing(false);
          return true;
        }}>
        <Mapbox.Camera
          defaultSettings={{
            centerCoordinate: coords
              ? coords
              : savedLocation.data
                ? getCoords(savedLocation.data)
                : undefined,
            zoomLevel: zoom,
          }}
          centerCoordinate={
            locationServicesEnabled && following ? coords : undefined
          }
          zoomLevel={following ? zoom : undefined}
          animationDuration={1000}
          animationMode="flyTo"
          followUserLocation={false}
        />

        {isFinishedLoading && <ObservationMapLayer />}
        {coords !== undefined && locationServicesEnabled && (
          <UserLocation
            visible={isFocused}
            minDisplacement={MIN_DISPLACEMENT}
          />
        )}
        {locationHistory.length > 1 && (
          <>
            <ShapeSource id="routeSource" shape={toRoute(locationHistory)}>
              <LineLayer
                id="routeFill"
                style={{
                  lineColor: '#ff0000',
                  lineWidth: 5,
                  lineCap: LineJoin.Round,
                  lineOpacity: 1.84,
                }}
              />
            </ShapeSource>
          </>
        )}
      </Mapbox.MapView>
      <ScaleBar
        zoom={zoom || 10}
        latitude={coords ? coords[1] : undefined}
        bottom={20}
      />
      {coords !== undefined && locationServicesEnabled && (
        <View style={styles.locationButton}>
          <IconButton onPress={handleLocationPress}>
            {following ? <LocationFollowingIcon /> : <LocationNoFollowIcon />}
          </IconButton>
        </View>
      )}
      <AddButton
        testID="addButtonMap"
        onPress={handleAddPress}
        isLoading={!isFinishedLoading}
      />
      <GPSModal />
    </View>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});

function toRoute(locations: FullLocationData[]): LineString {
  return {
    type: 'LineString',
    coordinates: locations.map(location => [
      location.coords.longitude,
      location.coords.latitude,
    ]),
  };
}
