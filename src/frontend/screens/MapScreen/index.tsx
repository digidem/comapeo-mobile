import * as React from 'react';
import Mapbox from '@rnmapbox/maps';

import {
  LocationFollowingIcon,
  LocationNoFollowIcon,
} from '../../sharedComponents/icons';

import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ObservationMapLayer} from './MapLayers/ObservationMapLayer';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {usePresetsQuery} from '../../hooks/server/presets';
import ScaleBar from 'react-native-scale-bar';
import {TrackBottomSheet} from './TrackBottomSheet';
import {CurrentTrackMapLayer} from './CurrentTrack/CurrrentTrackMapLayer';

import {useMapStyleJsonUrl} from '../../hooks/server/maps';
import {TracksMapLayer} from './MapLayers/TracksMapLayer';
import {assert} from '../../lib/assert';
import {RemoteDetectionAlertsMapLayer} from './MapLayers/RemoteDetectionAlertsLayer';
import {matchPreset} from '../../lib/utils';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {GPSPill} from '../../sharedComponents/GPSPill';
import AddButtonSVG from '../../images/AddButton.svg';
import {AuthState, useAuthContext} from '../../contexts/AuthContext';
import {useLocationState} from '../../contexts/LocationContext';
import {getCoords} from '../../lib/coordinateFormat';
import {useTracking} from '../../hooks/useTracking';
import {UserTooltipMarker} from './CurrentTrack/UserTooltipMarker';
import {useNonReactiveSavedLocation} from '../../contexts/SavedLocationContext';

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

// Where Peru, Columbia, and Brazil Meet
const FALLBACK_COORDINATE = [-69.945, -4.231944];

assert(
  process.env.MAPBOX_ACCESS_TOKEN,
  'MAPBOX_ACCESS_TOKEN environment variable should be set',
);
Mapbox.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN);
const MIN_DISPLACEMENT = 3;

export const MapScreen = ({
  route,
  navigation,
}: NativeHomeTabsNavigationProps<'Map'>) => {
  const trackBottomSheetOpen = route.params?.trackingOpen;
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
  const [isFinishedLoading, setIsFinishedLoading] = React.useState(false);

  const {newDraft} = useDraftObservation();
  const {navigate} = useNavigationFromHomeTabs();
  const location = useLocationState(store => store.throttledMapLocation);
  const coords = location && getCoords(location);
  const [following, setFollowing] = React.useState(true);
  const {isTracking} = useTracking();
  const {data: styleUrl} = useMapStyleJsonUrl();

  const {authState} = useAuthContext();
  const {savedLocation} = useNonReactiveSavedLocation();
  const initialPositionSet = React.useRef(false);

  useCheckDraftObservationAndNavigate({authState});

  const handleAddPress = () => {
    newDraft();
    navigate('PresetChooser');
  };

  // This closes the track bottom sheet whenever the user is navigated away.
  // This prevents the closing animation from happening when the map screen is being reopened
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.setParams({trackingOpen: false});
      };
    }, [navigation]),
  );

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
        styleURL={styleUrl}
        onMapIdle={event => {
          setZoom(event.properties.zoom);
        }}
        onDidFinishLoadingStyle={handleDidFinishLoadingStyle}
        onMoveShouldSetResponder={() => {
          if (following) setFollowing(false);
          return true;
        }}>
        <Mapbox.Camera
          ref={cam => {
            if (cam && !initialPositionSet.current) {
              cam.setCamera({
                centerCoordinate: coords
                  ? coords
                  : savedLocation
                    ? getCoords(savedLocation)
                    : FALLBACK_COORDINATE,
                zoomLevel: DEFAULT_ZOOM,
              });
              initialPositionSet.current = true;
            }
          }}
          centerCoordinate={following ? coords : undefined}
          zoomLevel={DEFAULT_ZOOM}
          animationDuration={1000}
          animationMode="flyTo"
          followUserLocation={false}
        />

        {coords && <Mapbox.UserLocation minDisplacement={MIN_DISPLACEMENT} />}

        {isFinishedLoading && authState !== 'obscured' && (
          <>
            <RemoteDetectionAlertsMapLayer />
            {isTracking && (
              <>
                <CurrentTrackMapLayer />
                <UserTooltipMarker />
              </>
            )}
            <TracksMapLayer />
            <ObservationMapLayer />
          </>
        )}
      </Mapbox.MapView>
      <View style={styles.bottomContainer}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <GPSPill onPress={() => navigation.navigate('GpsModal')} />
        </View>

        <TouchableOpacity
          testID="MAIN.add-observation-btn"
          accessibilityLabel="Add Observation"
          onPress={handleAddPress}>
          <AddButtonSVG />
        </TouchableOpacity>

        {coords ? (
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center'}}
            onPress={handleLocationPress}>
            {following ? <LocationFollowingIcon /> : <LocationNoFollowIcon />}
          </TouchableOpacity>
        ) : (
          <View style={{width: 0, height: 0, flex: 1}} />
        )}
      </View>
      <ScaleBar
        zoom={zoom || 10}
        latitude={coords ? coords[1] : undefined}
        bottom={20}
      />

      {trackBottomSheetOpen && <TrackBottomSheet />}
    </View>
  );
};

function useCheckDraftObservationAndNavigate({
  authState,
}: {
  authState: AuthState;
}) {
  const {data: presets} = usePresetsQuery();
  const {navigate} = useNavigationFromHomeTabs();
  const existingObservation = usePersistedDraftObservation(
    store => store.value,
  );

  useFocusEffect(
    React.useCallback(() => {
      // if no exisiting observation, stay home
      if (!existingObservation || authState === 'obscured') {
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
    }, [existingObservation, navigate, presets, authState]),
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
    width: '100%',
  },
});
