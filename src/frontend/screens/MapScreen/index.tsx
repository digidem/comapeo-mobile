import * as React from 'react';
import {Camera, MapView, UserLocation} from '@maplibre/maplibre-react-native';
import {
  LocationFollowingIcon,
  LocationNoFollowIcon,
} from '../../sharedComponents/icons';

import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ObservationMapLayer} from './MapLayers/ObservationMapLayer';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import ScaleBar from 'react-native-scale-bar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TrackBottomSheet} from './TrackBottomSheet';
import {CurrentTrackMapLayer} from './CurrentTrack/CurrentTrackMapLayer';

import {useMapStyleJsonUrl} from '../../hooks/server/maps';
import {TracksMapLayer} from './MapLayers/TracksMapLayer';
import {assert} from '../../lib/assert';
import {RemoteDetectionAlertsMapLayer} from './MapLayers/RemoteDetectionAlertsLayer';
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
import {useResetMapLayout} from '../../hooks/useResetMapLayout';
import {
  useLowStorageBannerActions,
  useLowStorageBannerState,
} from '../../contexts/LowStorageBannerContext';
import {useStorageReadingQuery} from '../../hooks/useStorageReadingQuery';
import {isLowStorage} from '../../lib/storage';
import {LowStorageBanner} from '../../sharedComponents/Storage/LowStorageBanner';
import {useAppUsageStatsStore} from '../../contexts/AppUsageStatsContext';
import {useShouldShowAppUsagePrompt} from '../../hooks/useShouldShowAppUsagePrompt';
import {useTrackState} from '../../contexts/TrackStoreContext';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';

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
const MIN_DISPLACEMENT = 3;

export const MapScreen = ({
  route,
  navigation,
}: NativeHomeTabsNavigationProps<'Map'>) => {
  const trackBottomSheetOpen = route.params?.trackingOpen;
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
  const [isFinishedLoadingStyle, setIsFinishedLoadingStyle] =
    React.useState(false);
  const {dimensions, mapKey, onLayout} = useResetMapLayout();
  const {createDraft} = useDraftObservationActions();
  const {navigate} = useNavigationFromHomeTabs();
  const {isTracking} = useTracking();
  const location = useLocationState(store =>
    isTracking ? store.location : store.throttledMapLocation,
  );
  const coords = location && getCoords(location);
  const [following, setFollowing] = React.useState(true);
  const appUsageStore = useAppUsageStatsStore();

  const {data: styleUrl} = useMapStyleJsonUrl();

  const {authState} = useAuthContext();
  const {savedLocation} = useNonReactiveSavedLocation();
  const initialPositionSet = React.useRef(false);
  const dismissedMapBannerSession = useLowStorageBannerState(
    s => s.dismissedMapBannerSession,
  );
  const {setDismissedMapBannerSession} = useLowStorageBannerActions();
  const {data} = useStorageReadingQuery();
  const isLow = isLowStorage(data.freeBytes);
  const insets = useSafeAreaInsets();
  const BANNER_TOP = insets.top + 75;

  useCheckDraftObservationAndNavigate({authState});
  useCheckUnsavedTrackAndNavigate({authState});

  useShouldShowAppUsagePrompt();

  // if the user is on the map screen onboarding is not completed, record that they have completed it (this is because the app usage stats was added after the user already onboarded)
  //using the store as this value does not need to be reactive
  if (!appUsageStore.instance.getState().completedOnboardingAt) {
    appUsageStore.actions.recordCompleteOnboarding();
  }

  // This closes the track bottom sheet whenever the user is navigated away.
  // This prevents the closing animation from happening when the map screen is being reopened
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.setParams({trackingOpen: false});
      };
    }, [navigation]),
  );

  const handleAddPress = () => {
    createDraft();
    navigate('ObservationCategoryChooser');
  };

  function handleLocationPress() {
    setZoom(DEFAULT_ZOOM);
    setFollowing(prev => !prev);
  }

  function handleDidFinishLoadingStyle() {
    setIsFinishedLoadingStyle(true);
  }

  return (
    <View style={{flex: 1}} onLayout={onLayout} testID="MAIN.map-screen">
      <View
        pointerEvents="box-none"
        style={[styles.lowStorageBanner, {top: BANNER_TOP}]}>
        {isLow && !dismissedMapBannerSession && (
          <LowStorageBanner
            onDismiss={() => setDismissedMapBannerSession(true)}
            testID="MAP:low-storage-banner"
          />
        )}
      </View>
      {dimensions && (
        <MapView
          key={mapKey}
          testID="MAIN.mapbox-map-view"
          style={{width: dimensions.width, height: dimensions.height}}
          logoEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          surfaceView={true}
          attributionPosition={{right: 8, bottom: 8}}
          compassEnabled={false}
          mapStyle={styleUrl}
          onDidFinishLoadingStyle={handleDidFinishLoadingStyle}
          onRegionWillChange={event => {
            if (event.properties.isUserInteraction && following) {
              setFollowing(false);
            }
          }}
          onRegionDidChange={event => {
            setZoom(event.properties.zoomLevel);
          }}>
          <Camera
            ref={cam => {
              if (cam && !initialPositionSet.current) {
                cam.setCamera({
                  centerCoordinate: coords
                    ? coords
                    : savedLocation
                      ? getCoords(savedLocation)
                      : FALLBACK_COORDINATE,
                  zoomLevel: DEFAULT_ZOOM,
                  animationDuration: 50,
                });
                initialPositionSet.current = true;
              }
            }}
            centerCoordinate={following ? coords : undefined}
            zoomLevel={DEFAULT_ZOOM}
            animationDuration={0}
            followUserLocation={false}
          />

          {coords && (
            <UserLocation minDisplacement={isTracking ? 0 : MIN_DISPLACEMENT} />
          )}

          {isFinishedLoadingStyle && authState !== 'obscured' && (
            <>
              <RemoteDetectionAlertsMapLayer />
              <CurrentTrackMapLayer location={location} />
              {isTracking && <UserTooltipMarker />}
              <TracksMapLayer />
              <ObservationMapLayer />
            </>
          )}
        </MapView>
      )}
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

      <TrackBottomSheet isOpen={!!trackBottomSheetOpen} />
    </View>
  );
};

function useCheckDraftObservationAndNavigate({
  authState,
}: {
  authState: AuthState;
}) {
  const {navigate} = useNavigationFromHomeTabs();
  const existingObservation = useDraftObservationState(store => store.value);
  const id = useDraftObservationState(store => store.id);

  useFocusEffect(
    React.useCallback(() => {
      // if no exisiting observation, stay home
      if (!existingObservation || authState === 'obscured') {
        return;
      }
      // if existing observation and no preset match, user has started creating an observation but had not chosen a preset, so navigate to preset chooser
      if (!existingObservation.presetRef) {
        navigate('ObservationCategoryChooser');

        // if existing observation, preset match, and docId exists, navigate to Observation Edit Screen
      } else if (id?.docId) {
        navigate('ObservationEdit');
      } else {
        navigate('ObservationCreate');
      }
    }, [existingObservation, navigate, authState, id]),
  );
}

function useCheckUnsavedTrackAndNavigate({authState}: {authState: AuthState}) {
  const {navigate} = useNavigationFromHomeTabs();
  const hasUnsavedTrack = useTrackState(
    state => !state.isTracking && state.locationHistory.length > 0,
  );
  const trackPreset = useTrackState(state => state.preset);

  useFocusEffect(
    React.useCallback(() => {
      // if no unsaved track or auth is obscured, stay home
      if (!hasUnsavedTrack || authState === 'obscured') {
        return;
      }

      // if no preset chosen, navigate to category chooser
      if (!trackPreset) {
        navigate('TrackCategoryChooser', {trackAction: 'saveNew'});
      } else {
        // if preset chosen, navigate to save track screen
        navigate('SaveTrack');
      }
    }, [hasUnsavedTrack, trackPreset, navigate, authState]),
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
  lowStorageBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 2,
    elevation: 2,
  },
});
