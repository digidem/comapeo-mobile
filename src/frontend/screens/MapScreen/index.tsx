import * as React from 'react';
import Mapbox from '@rnmapbox/maps';

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
import {useLastKnownLocation} from '../../hooks/useLastSavedLocation';
import {GPSPermissionsModal} from './GPSPermissions/GPSPermissionsModal';
import {TrackPathLayer} from './track/TrackPathLayer';
import {UserLocation} from './UserLocation';
import {useMapStyleUrl} from '../../hooks/server/mapStyleUrl';
import {ParameterChanges, getCoords} from '../../hooks/useLocation';
import {useLocationWithProviderStatus} from '../../hooks/useLocationWithProviderStatus';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

Mapbox.setAccessToken(config.mapboxAccessToken);
const MIN_DISPLACEMENT = 3;

function locationFilter({distance, time}: ParameterChanges) {
  return time >= 1000 || distance >= 15;
}

export const MapScreen = () => {
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
  const [isFinishedLoading, setIsFinishedLoading] = React.useState(false);
  const [following, setFollowing] = React.useState(true);
  const {newDraft} = useDraftObservation();
  const {navigate} = useNavigationFromHomeTabs();
  const {locationState, providerStatusState} =
    useLocationWithProviderStatus(locationFilter);
  const coords = locationState.location && getCoords(locationState.location);
  const savedLocation = useLastKnownLocation();
  const locationServicesEnabled =
    providerStatusState.locationProviderStatus?.locationServicesEnabled;

  const styleUrlQuery = useMapStyleUrl();

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
        styleURL={styleUrlQuery.data}
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
            locationServicesEnabled && following && coords ? coords : undefined
          }
          zoomLevel={following ? zoom : undefined}
          animationDuration={1000}
          animationMode="flyTo"
          followUserLocation={false}
        />

        {coords && locationServicesEnabled && (
          <UserLocation minDisplacement={MIN_DISPLACEMENT} />
        )}
        {isFinishedLoading && <ObservationMapLayer />}
        {isFinishedLoading && <TrackPathLayer />}
      </Mapbox.MapView>
      <ScaleBar
        zoom={zoom || 10}
        latitude={coords ? coords[1] : undefined}
        bottom={20}
      />
      {coords && locationServicesEnabled && (
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
      <GPSPermissionsModal />
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
