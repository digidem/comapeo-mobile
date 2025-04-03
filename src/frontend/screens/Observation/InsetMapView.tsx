import MapboxGL from '@rnmapbox/maps';
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {WHITE} from '../../lib/styles';
import {FormattedCoords} from '../../sharedComponents/FormattedData';
import {useMapStyleJsonUrl} from '../../hooks/server/maps';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import MapPin from '../../images/MapPin.svg';
import OrangeDot from '../../images/OrangeDot.svg';
import {MarkerView} from '@rnmapbox/maps';
import {BodyText} from '../../sharedComponents/Text/BodyText';

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
    const styleUrlQuery = useMapStyleJsonUrl();
    const {navigate} = useNavigationFromRoot();

    return (
      <MapboxGL.MapView
        style={styles.map}
        zoomEnabled={false}
        logoEnabled={false}
        scrollEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
        styleURL={styleUrlQuery.data}>
        <MapboxGL.Camera
          centerCoordinate={[lon, lat]}
          zoomLevel={12}
          animationMode="none"
        />
        <MarkerView
          onTouchEnd={() => console.log('touch')}
          id="locationIndicator"
          anchor={{x: 0.5, y: 0.75}}
          coordinate={[lon, lat]}>
          <>
            <TouchableOpacity
              onPress={() => navigate('ObservationMetadata', {observationId})}
              style={styles.coords}>
              <MapPin style={{marginRight: 5}} />
              <BodyText variant="tinyMeta">
                <FormattedCoords
                  format={coordinateFormat}
                  lat={lat}
                  lon={lon}
                />
                {accuracy && ` ± ${accuracy.toFixed(2)} m`}
              </BodyText>
            </TouchableOpacity>
            <View style={styles.arrow} />

            <OrangeDot style={{alignSelf: 'center'}} />
          </>
        </MarkerView>
      </MapboxGL.MapView>
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
