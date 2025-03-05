import * as React from 'react';
import Mapbox from '@rnmapbox/maps';

import {IconButton} from '../../sharedComponents/IconButton';
import {
  LocationFollowingIcon,
  LocationNoFollowIcon,
} from '../../sharedComponents/icons';

import {View, StyleSheet} from 'react-native';
import {ObservationMapLayer} from './MapLayers/ObservationMapLayer';
import {AddButton} from '../../sharedComponents/AddButton';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {usePresetsQuery} from '../../hooks/server/presets';
import ScaleBar from 'react-native-scale-bar';
import {getCoords} from '../../hooks/useLocation';
import {useLastKnownLocation} from '../../hooks/useLastSavedLocation';
import {useLocationProviderStatus} from '../../hooks/useLocationProviderStatus';
import {GPSPermissionsModal} from './GPSPermissions/GPSPermissionsModal';
import {CurrentTrackMapLayer} from './CurrentTrack/CurrrentTrackMapLayer';
import {UserLocation} from './UserLocation';
import {useSharedLocationContext} from '../../contexts/SharedLocationContext';
import {useMapStyleJsonUrl} from '../../hooks/server/maps';
import {TracksMapLayer} from './MapLayers/TracksMapLayer';
import {assert} from '../../lib/assert';
import {RemoteDetectionAlertsMapLayer} from './MapLayers/RemoteDetectionAlertsLayer';
import {matchPreset} from '../../lib/utils';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

assert(
  process.env.MAPBOX_ACCESS_TOKEN,
  'MAPBOX_ACCESS_TOKEN environment variable should be set',
);
Mapbox.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN);
const MIN_DISPLACEMENT = 3;

export const MapScreen = () => {
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
  const [isFinishedLoading, setIsFinishedLoading] = React.useState(false);
  const [following, setFollowing] = React.useState(true);
  const {newDraft} = useDraftObservation();
  const {navigate} = useNavigationFromHomeTabs();
  const {locationState} = useSharedLocationContext();
  const savedLocation = useLastKnownLocation();
  const coords = locationState.location && getCoords(locationState.location);
  const locationProviderStatus = useLocationProviderStatus();
  const locationServicesEnabled =
    !!locationProviderStatus?.locationServicesEnabled;

  const styleUrlQuery = useMapStyleJsonUrl();
  const existingObservation = usePersistedDraftObservation(
    store => store.value,
  );
  const {data: presets} = usePresetsQuery();
  const isFocused = useIsFullyFocused();

  React.useEffect(() => {
    if (isFocused) {
      // if no exisiting observation, stay home
      if (!existingObservation) {
        return;
      }
      // if existing observation and no preset match, user has started creating an observation but had not chosen a preset, so navigate to preset chooser
      if (!matchPreset(existingObservation.tags, presets)) {
        navigate('PresetChooser');

        // if existing observation, preset match, and docId exists, navigate to Observation Edit Screen
      } else if ('docId' in existingObservation) {
        navigate('ObservationEdit', {observationId: existingObservation.docId});
      } else {
        navigate('ObservationCreate');
      }
    }
  }, [isFocused]);

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
        testID="MAIN.mapbox-map-view"
        style={{flex: 1}}
        logoEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        surfaceView={true}
        attributionPosition={{right: 8, bottom: 8}}
        compassEnabled={false}
        scaleBarEnabled={false}
        styleURL={styleUrlQuery.data}
        onMapIdle={event => {
          setZoom(event.properties.zoom);
        }}
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

        {coords && locationServicesEnabled && (
          <UserLocation minDisplacement={MIN_DISPLACEMENT} />
        )}

        {isFinishedLoading && (
          <>
            <RemoteDetectionAlertsMapLayer />
            <CurrentTrackMapLayer />
            <TracksMapLayer />
            <ObservationMapLayer />
          </>
        )}
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
        testID="MAIN.add-observation-btn"
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
