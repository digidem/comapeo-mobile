import {Map, Camera, Marker} from '@maplibre/maplibre-react-native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {WHITE, DARK_ORANGE} from '../../lib/styles';
import {FormattedCoords} from '../../sharedComponents/FormattedData';
import {useMapStyleJsonUrl} from '../../hooks/server/maps';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import MapPin from '../../images/MapPin.svg';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext';
import {useUnitSystem} from '../../contexts/UnitSystemStoreContext';
import {metersOrConversion} from '../../lib/unitConversion';

const MAP_HEIGHT = 175;

type MapProps = {
  lon: number;
  lat: number;
  observationId: string;
  accuracy?: number;
  color?: string;
};

export const InsetMapView = ({
  lon,
  lat,
  observationId,
  accuracy,
  color,
}: MapProps) => {
  const coordinateFormat = useCoordinateFormat();
  const unitSystem = useUnitSystem();
  const {data: styleUrl} = useMapStyleJsonUrl();
  const {navigate} = useNavigationFromRoot();
  let accuracyItem = '';
  if (accuracy) {
    const {value, unit} = metersOrConversion(accuracy, unitSystem);
    accuracyItem = ` ± ${value.toFixed(2)} ${unit}`;
  }

  return (
    <Map
      style={styles.map}
      touchZoom={false}
      doubleTapHoldZoom={false}
      doubleTapZoom={false}
      logo={false}
      dragPan={false}
      touchPitch={false}
      touchRotate={false}
      compass={false}
      androidView={'texture'}
      mapStyle={styleUrl}>
      <Camera center={[lon, lat]} zoom={12} easing="linear" />
      <Marker id="locationIndicator" anchor={'top'} lngLat={[lon, lat]}>
        <TouchableOpacity
          accessibilityLabel="Open observation metadata via map pin"
          onPress={() => navigate('ObservationMetadata', {observationId})}
          style={{alignSelf: 'center'}}>
          <View style={styles.coords}>
            <MapPin style={{marginRight: 5}} />
            <BodyText variant="tinyMeta">
              <FormattedCoords format={coordinateFormat} lat={lat} lon={lon} />
              {accuracyItem}
            </BodyText>
          </View>
          <View style={styles.arrow} />
          <View style={[styles.dot, {backgroundColor: color ?? DARK_ORANGE}]} />
        </TouchableOpacity>
      </Marker>
    </Map>
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
  dot: {
    alignSelf: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: WHITE,
  },
});
