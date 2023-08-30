// import {$Diff} from "utility-types";
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapboxGL, {Logger} from '@react-native-mapbox-gl/maps';
import ScaleBar from 'react-native-scale-bar';
import CheapRuler from 'cheap-ruler';
import validateColor from 'validate-color';
// import ConfigContext from "../../context/ConfigContext";
import {LocationFollowingIcon, LocationNoFollowIcon} from '../icons';
import IconButton from '../IconButton';
// import type { LocationContextType } from "../../context/LocationContext";
// import type { ObservationsMap } from "../../context/ObservationsContext";
// import {useIsFullyFocused} from "../../hooks/useIsFullyFocused";
// import bugsnag from "../../lib/logger";
import config from '../../../config.json';
import {OfflineMapLayers} from '../OfflineMapLayers';
import {UserLocation} from './UserLocation';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;
// The fallback map style does not include much detail, so at zoom 12 it looks
// empty. If the fallback map is used, then we use zoom 4 as the default zoom.
const DEFAULT_ZOOM_FALLBACK_MAP = 4;
const DEFAULT_MARKER_COLOR = '#F29D4B';
// Suppress expected warnings in logs - see https://github.com/react-native-mapbox-gl/maps/issues/943#issuecomment-759220852
Logger.setLogCallback(log => {
  const {message} = log;
  // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
  return (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  );
});
MapboxGL.setAccessToken(config.mapboxAccessToken);
// Forces Mapbox to always be in connected state, rather than reading system
// connectivity state
MapboxGL.setConnected(true);
type ObservationFeature = {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number] | [number, number, number];
  };
  properties: {
    id: string;
  };
};

// /**
//  * Convert a map of observations into a GeoJSON FeatureCollection
//  *
//  * @param {{ [string]: ObservationType }} Observations
//  * @returns GeoJSON FeatureCollection with Features that have the observation
//  * location and id
//  */
// function mapObservationsToFeatures(
//     obsMap: ObservationsMap,
// ): ObservationFeature[] {
//     const features = [];

//     for (const obs of obsMap.values()) {
//         // Only include observations with a location in the map view
//         if (typeof obs.lon === "number" && typeof obs.lat === "number") {
//             features.push({
//                 type: "Feature",
//                 geometry: {
//                     type: "Point",
//                     coordinates: [obs.lon, obs.lat],
//                 },
//                 properties: {
//                     id: obs.id,
//                     categoryId:
//                         obs.tags && obs.tags.categoryId
//                             ? obs.tags.categoryId
//                             : undefined,
//                 },
//             });
//         }
//     }

//     return features;
// }

// Min distance in meters the user moves before the map will re-render (saves
// lots of map renders when the user is standing still, which uses up battery
// life)
const MIN_DISPLACEMENT = 15;

// const ObservationMapLayer = ({
//     // observations,
//     onPress,
// }: {
//     // observations: ObservationsMap;
//     onPress: (event: {
//         nativeEvent?: {
//             payload?: {
//                 properties?: {
//                     id: string;
//                 };
//             };
//         };
//     }) => void;
// }) => {
//     // const [{presets}] = React.useContext(ConfigContext);
//     // const featureCollection = {
//     //     type: "FeatureCollection",
//     //     features: mapObservationsToFeatures(observations),
//     // };
//     // const layerStyles = React.useMemo(() => {
//     //     // Based on example implementation:
//     //     // https://github.com/react-native-mapbox-gl/maps/blob/d6e7257e705b8e0be5d2d365a495c514b7f015f5/example/src/examples/SymbolCircleLayer/DataDrivenCircleColors.js
//     //     const categoryColorPairs = [];
//     //     presets.forEach(({color}, id) => {
//     //         if (color && validateColor(color)) {
//     //             categoryColorPairs.push(id, color);
//     //         }
//     //     });
//     //     return {
//     //         circleColor:
//     //             categoryColorPairs.length > 0
//     //                 ? [
//     //                       "match",
//     //                       ["get", "categoryId"],
//     //                       ...categoryColorPairs,
//     //                       DEFAULT_MARKER_COLOR,
//     //                   ]
//     //                 : DEFAULT_MARKER_COLOR,
//     //         circleRadius: 5,
//     //         circleStrokeColor: "#fff",
//     //         circleStrokeWidth: 2,
//     //     };
//     // }, [presets]);
//     return (
//         <MapboxGL.ShapeSource
//             onPress={onPress}
//             id="observations-source"
//             shape={featureCollection}
//         >
//             <MapboxGL.CircleLayer id="circles" style={layerStyles} />
//         </MapboxGL.ShapeSource>
//     );
// };

type Props = {
  // observations: ObservationsMap;
  styleURL: string;
  isOfflineFallback: boolean;
  // location: LocationContextType;
  onPressObservation: (observationId: string) => any;
  isFocused: boolean;
};
type Coords = [number, number];
type State = {
  // True if the map is following user location
  following: boolean;
  hasFinishedLoadingStyle?: boolean;
  zoom: number;
  // lon, lat
  coords: Coords;
};

// function getCoords(location: LocationContextType): [number, number] {
//     const pos = location.position || location.savedPosition;
//     return pos ? [pos.coords.longitude, pos.coords.latitude] : [0, 0];
// }

export const MapView = ({
  styleURL,
  isOfflineFallback,
  onPressObservation,
  isFocused,
}: Props) => {
  const [following, setFollowing] = useState<State['following']>(false);
  /* TODO: infer from location context (?):
    !!props.location.provider &&
                props.location.provider.locationServicesEnabled,
    */
  const [zoom, setZoom] = useState<State['zoom']>(0);
  /* TODO: infer from location context (?):
   props.location.provider &&
                props.location.provider.locationServicesEnabled
                    ? DEFAULT_ZOOM_FALLBACK_MAP
                    : 0.1,
   */
  const [coords, setCoords] = useState<Coords>([0, 0]);

  const mapRef = useRef<MapboxGL.MapView>();
  const zoomRef = useRef<number>();
  const coordsRef = useRef<Coords>();

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  const handleLocationPress = () => {};
  const handleRegionWillChange = () => {};
  const handleRegionIsChanging = () => {};
  const handleRegionDidChange = () => {};
  const handleDidFinishLoadingStyle = () => {};

  return (
    <>
      <MapboxGL.MapView
        testID="mapboxMapView"
        style={{
          flex: 1,
        }}
        ref={mapRef}
        maxZoomLevel={22}
        logoEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        surfaceView={true}
        attributionPosition={{
          right: 8,
          bottom: 8,
        }}
        // onDidFailLoadingMap={e =>
        //     bugsnag.notify(
        //         new Error("Failed to load map"),
        //         report => {
        //             report.severity = "error";
        //             report.context = "onDidFailLoadingMap";
        //         },
        //     )
        // }
        onDidFinishLoadingStyle={handleDidFinishLoadingStyle}
        // onDidFinishRenderingMap={() =>
        //     bugsnag.leaveBreadcrumb("onDidFinishRenderingMap")
        // }
        onDidFinishRenderingMapFully={() => {
          if (!isOfflineFallback) {
            // For the fallback offline map (that does not contain much
            // detail) we stay at zoom 4, but if we do load a style then we
            // zoom in to DEFAULT_ZOOM (zoom 12) once the map loads
            // this.zoomRef = DEFAULT_ZOOM;
            setZoom(DEFAULT_ZOOM);
          }

          // bugsnag.leaveBreadcrumb("onDidFinishRenderingMapFully");
        }}
        // onWillStartLoadingMap={() =>
        //     bugsnag.leaveBreadcrumb("onWillStartLoadingMap")
        // }
        // onDidFinishLoadingMap={() =>
        //     bugsnag.leaveBreadcrumb("onDidFinishLoadingMap")
        // }
        compassEnabled={false}
        styleURL={styleURL}
        onRegionWillChange={handleRegionWillChange}
        onRegionIsChanging={handleRegionIsChanging}
        onRegionDidChange={handleRegionDidChange}>
        <MapboxGL.Camera
          defaultSettings={{
            centerCoordinate: coordsRef.current || coords || [0, 0],
            zoomLevel: zoomRef.current || zoom || DEFAULT_ZOOM,
          }}
          // centerCoordinate={
          //     following ? getCoords(location) : undefined
          // }
          centerCoordinate={undefined}
          zoomLevel={!following ? undefined : zoomRef.current || zoom}
          animationDuration={1000}
          animationMode="flyTo"
          followUserLocation={false}
        />
        {/* {this.state.hasFinishedLoadingStyle && (
                        <ObservationMapLayer
                            onPress={this.handleObservationPress}
                            observations={observations}
                        />
                    )} */}
        {isOfflineFallback ? <OfflineMapLayers /> : null}
        {/* {locationServicesEnabled ? (
                        <UserLocation
                            visible={isFocused}
                            minDisplacement={MIN_DISPLACEMENT}
                        />
                    ) : null} */}
      </MapboxGL.MapView>
      <ScaleBar
        zoom={zoom || 10}
        latitude={coords ? coords[1] : undefined}
        bottom={20}
      />
      <View style={styles.locationButton}>
        <IconButton onPress={handleLocationPress}>
          {following ? <LocationFollowingIcon /> : <LocationNoFollowIcon />}
        </IconButton>
      </View>
    </>
  );
};

const FocusAwareMapView = (props: Props & {isFocused: boolean}) => {
  const isFocused = useIsFullyFocused();
  return <MapView {...props} isFocused={isFocused} />;
};

export default FocusAwareMapView; // Shallow compare objects, but omitting certain keys from the comparison

// function shallowDiffers(a: any, b: any, omit: string[] = []) {
//     for (const i in a) if (!(i in b)) return true;

//     for (const i in b) {
//         if (a[i] !== b[i] && omit.indexOf(i) === -1) return true;
//     }

//     return false;
// }

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});
