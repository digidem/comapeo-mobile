import * as React from 'react';
import Mapbox, {UserLocation} from '@rnmapbox/maps';
import config from '../../../config.json';
import {IconButton} from '../../sharedComponents/IconButton';
import {
  LocationFollowingIcon,
  LocationNoFollowIcon,
} from '../../sharedComponents/icons';
import {View, StyleSheet} from 'react-native';
import {ObservationMapLayer} from './ObsevationMapLayer';
import {AddButton} from '../../sharedComponents/AddButton';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../hooks/useDraftObservation';
// @ts-ignore
import ScaleBar from 'react-native-scale-bar';
import {getCoords, useLocation} from '../../hooks/useLocation';
import {getLastKnownPositionAsync} from 'expo-location';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

Mapbox.setAccessToken(config.mapboxAccessToken);
const MIN_DISPLACEMENT = 15;

export const MAP_STYLE = Mapbox.StyleURL.Outdoors;

export const MapScreen = () => {
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
  const [savedCoords, setSavedCoords] = React.useState<number[] | undefined>(
    undefined,
  );
  const isFocused = useIsFullyFocused();
  const [isFinishedLoading, setIsFinishedLoading] = React.useState(false);
  const [following, setFollowing] = React.useState(false);
  const {newDraft} = useDraftObservation();
  const {navigate} = useNavigationFromHomeTabs();
  const {location} = useLocation({maxDistanceInterval: MIN_DISPLACEMENT});
  const coords = location && getCoords(location);

  const handleAddPress = () => {
    newDraft();
    navigate('PresetChooser');
  };

  // TO DO: create a hook that returns the saved location. setting the saved location after the render has begun defeats the purpose of having the savedlocation, as the saved location is used as a placeholder while the coordinates are being loaded. So we should use a suspenseQuery here, but we need to upgrade react-query before we do that which is out of scope of this PR.
  // React.useEffect(() => {
  //   getLastKnownPositionAsync()
  //     .then(savedLocation => {

  //       // if (savedLocation) {
  //       //   setSavedCoords([
  //       //     savedLocation.coords.latitude,
  //       //     savedLocation.coords.longitude,
  //       //   ]);
  //       // }
  //     })
  //     .catch(err => console.error(err));
  // }, []);

  React.useEffect(() => {
    Mapbox.setTelemetryEnabled(false);
  }, []);

  function handleLocationPress() {
    setZoom(DEFAULT_ZOOM);
    setFollowing(prev => !prev);
  }

  function handleDidFinishLoadingStyle() {
    setIsFinishedLoading(true);
    setFollowing(true);
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
            centerCoordinate: coords,
            zoomLevel: zoom,
          }}
          centerCoordinate={following ? coords : undefined}
          zoomLevel={following ? zoom : undefined}
          animationDuration={1000}
          animationMode="flyTo"
          followUserLocation={false}
        />

        {isFinishedLoading && <ObservationMapLayer />}
        {coords !== undefined && (
          <UserLocation
            visible={isFocused}
            minDisplacement={MIN_DISPLACEMENT}
          />
        )}
      </Mapbox.MapView>

      <ScaleBar
        zoom={zoom || 10}
        latitude={coords ? coords[1] : undefined}
        bottom={20}
      />
      {coords !== undefined && isFinishedLoading && (
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
