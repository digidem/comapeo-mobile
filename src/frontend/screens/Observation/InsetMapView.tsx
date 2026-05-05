import {MapView, Camera, MarkerView} from '@maplibre/maplibre-react-native';
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

export const InsetMapView = ({lon, lat, observationId, accuracy}: MapProps) => {
  const coordinateFormat = useCoordinateFormat();
  const {data: styleUrl} = useMapStyleJsonUrl();
  const {navigate} = useNavigationFromRoot();

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
      mapStyle={styleUrl}>
      <Camera
        centerCoordinate={[lon, lat]}
        zoomLevel={12}
        animationMode="moveTo"
      />
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
              <FormattedCoords format={coordinateFormat} lat={lat} lon={lon} />
              {accuracy && ` ± ${accuracy.toFixed(2)} m`}
            </BodyText>
          </View>
          <View style={styles.arrow} />
          <OrangeDot style={{alignSelf: 'center'}} />
        </TouchableOpacity>
      </MarkerView>
    </MapView>
  );
};

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
