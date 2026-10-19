import {Marker} from '@maplibre/maplibre-react-native';
import {StyleSheet, View} from 'react-native';

import {useTrackState} from '../../../contexts/TrackStoreContext';
import {useLocationState} from '../../../contexts/LocationContext';
import {useTrackTimer} from '../../../hooks/useTrackTimer.ts';
import {useUnitSystem} from '../../../contexts/UnitSystemStoreContext';
import {kmOrConversion} from '../../../lib/unitConversion';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

export const UserTooltipMarker = () => {
  const timer = useTrackTimer();
  const location = useLocationState(store => store.location);
  const totalDistance = useTrackState(state => state.distance);
  const unitSystem = useUnitSystem();
  const {value: distanceValue, unit: distanceUnit} = kmOrConversion(
    totalDistance,
    unitSystem,
  );
  const formattedDistance = distanceValue.toFixed(2);

  return (
    // We dont want to put this check in the parent because it will cause the parent (the map) to render too often
    location?.coords && (
      <Marker
        id="locationView"
        lngLat={[location.coords.longitude, location.coords.latitude]}
        anchor="bottom">
        <View style={styles.container} collapsable={false}>
          <View style={styles.wrapper}>
            <View>
              <BodyText variant="smallMeta" style={styles.text}>
                {formattedDistance} {distanceUnit}
              </BodyText>
            </View>
            <View style={styles.separator} />
            <BodyText variant="smallMeta" style={styles.text}>
              {timer}
            </BodyText>
            <View style={styles.indicator} />
          </View>
          <View style={styles.arrow} />
        </View>
      </Marker>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 13,
  },
  wrapper: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    color: '#333333',
  },
  separator: {
    marginLeft: 10,
    marginRight: 10,
    height: 12,
    borderColor: '#CCCCD6',
    borderLeftWidth: 1,
    color: '#CCCCD6',
  },
  indicator: {
    marginLeft: 5,
    height: 10,
    width: 10,
    borderRadius: 99,
    backgroundColor: '#59A553',
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 15,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopColor: '#FFF',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
