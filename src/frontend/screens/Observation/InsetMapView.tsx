import {
  MapView,
  Camera,
  MarkerView,
  type CameraRef,
} from '@maplibre/maplibre-react-native';
import React, {useRef, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {WHITE} from '../../lib/styles';
import {FormattedCoords} from '../../sharedComponents/FormattedData';
import {useMapStyleJsonUrl} from '../../hooks/server/maps';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import MapPin from '../../images/MapPin.svg';
import OrangeDot from '../../images/OrangeDot.svg';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext';

const MAP_HEIGHT = 175;

type MapProps = {
  lon: number;
  lat: number;
  observationId: string;
  accuracy?: number;
};

export const InsetMapView = React.memo<MapProps>(
  ({lon, lat, observationId, accuracy}: MapProps) => {
    const coordinateFormat = useCoordinateFormat();
    const {data: styleUrl} = useMapStyleJsonUrl();
    const {navigate} = useNavigationFromRoot();
    const cameraRef = useRef<CameraRef>(null);

    // Center the map imperatively only after the style has loaded.
    // Passing centerCoordinate as a prop triggers setNativeProps before the
    // style is ready, which causes a native crash on Android/iOS.
    const handleStyleLoaded = useCallback(() => {
      cameraRef.current?.setCamera({
        centerCoordinate: [lon, lat],
        zoomLevel: 12,
        animationDuration: 0,
      });
    }, [lon, lat]);

    return (
      <MapView
        style={styles.map}
        zoomEnabled={false}
        logoEnabled={false}
        scrollEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
        surfaceView={false}
        mapStyle={styleUrl}
        onDidFinishLoadingStyle={handleStyleLoaded}>
        <Camera ref={cameraRef} />
        <MarkerView
          id="locationIndicator"
          anchor={{x: 0.5, y: 0.8}}
          coordinate={[lon, lat]}>
          <TouchableOpacity
            accessibilityLabel="Open observation metadata via map pin"
            onPress={() => navigate('ObservationMetadata', {observationId})}
            style={{alignSelf: 'center'}}>
            <View style={styles.coords}>
              <MapPin style={{marginRight: 5}} />
              <BodyText variant="tinyMeta">
                <FormattedCoords
                  format={coordinateFormat}
                  lat={lat}
                  lon={lon}
                />
                {accuracy && ` ± ${accuracy.toFixed(2)} m`}
              </BodyText>
            </View>
            <View style={styles.arrow} />
            <OrangeDot style={{alignSelf: 'center'}} />
          </TouchableOpacity>
        </MarkerView>
      </MapView>
    );
  },
);

const styles = StyleSheet.create({
  coords: {
    padding: 10,
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  arrow: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: WHITE,
  },
  map: {
    height: MAP_HEIGHT,
  },
});
