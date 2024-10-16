import MapboxGL from '@rnmapbox/maps';
import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {BLACK, WHITE} from '../../lib/styles';
import {usePersistedSettings} from '../../hooks/persistedState/usePersistedSettings';
import {FormattedCoords} from '../../sharedComponents/FormattedData';
import {useMapStyleJsonUrl} from '../../hooks/server/maps';

const MAP_HEIGHT = 175;
const ICON_OFFSET = {x: 22, y: 21};

type MapProps = {
  lon: number;
  lat: number;
};

export const InsetMapView = React.memo<MapProps>(({lon, lat}: MapProps) => {
  const format = usePersistedSettings(store => store.coordinateFormat);
  const styleUrlQuery = useMapStyleJsonUrl();

  return (
    <View>
      <Image
        style={styles.mapIcon}
        source={require('../../images/observation-icon.png')}
      />
      <View style={styles.coords}>
        <View style={styles.coordsPointer} />
        <Text style={styles.positionText}>
          <FormattedCoords format={format} lat={lat} lon={lon} />
        </Text>
      </View>
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
      </MapboxGL.MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  coords: {
    zIndex: 10,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 15,
    bottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: WHITE,
  },
  coordsPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: WHITE,
    top: -10,
  },
  map: {
    height: MAP_HEIGHT,
  },
  mapIcon: {
    position: 'absolute',
    zIndex: 11,
    width: 44,
    height: 75,
    left: Dimensions.get('screen').width / 2 - ICON_OFFSET.x,
    bottom: MAP_HEIGHT / 2 - ICON_OFFSET.y,
  },
  positionText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: '700',
  },
});
