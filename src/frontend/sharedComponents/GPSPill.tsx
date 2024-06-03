import React, {FC, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './Text';
import {ParamListBase, useIsFocused} from '@react-navigation/native';
import {getLocationStatus} from '../lib/utils';
import {defineMessages, useIntl} from 'react-intl';
import {GpsIcon} from './icons';
import {BLACK, WHITE} from '../lib/styles';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useLocation} from '../hooks/useLocation';

const m = defineMessages({
  noGps: {
    id: 'sharedComponents.GpsPill.noGps',
    defaultMessage: 'No GPS',
  },
  searching: {
    id: 'sharedComponents.GpsPill.searching',
    defaultMessage: 'Searching…',
  },
});

interface GPSPill {
  navigation: BottomTabNavigationProp<ParamListBase, string, undefined>;
}

export const GPSPill: FC<GPSPill> = ({navigation}) => {
  const isFocused = useIsFocused();
  const {formatMessage: t} = useIntl();
  const locationState = useLocation();

  const precision = locationState?.location?.coords.accuracy;

  const status = getLocationStatus({locationState});

  const text = useMemo(
    () =>
      status === 'error'
        ? t(m.noGps)
        : status === 'searching'
          ? t(m.searching)
          : `± ${Math.round(precision!)} m`,
    [precision, status, t],
  );

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('GpsModal')}
      testID="gpsPillButton">
      <View
        style={[
          styles.container,
          status === 'error' ? styles.error : undefined,
        ]}>
        <View style={styles.icon}>
          {isFocused && <GpsIcon variant={status} />}
        </View>
        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    minWidth: 100,
    maxWidth: 200,
    borderRadius: 18,
    height: 36,
    paddingLeft: 32,
    paddingRight: 20,
    borderWidth: 3,
    borderColor: '#33333366',
    backgroundColor: BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  error: {backgroundColor: '#FF0000'},
  text: {color: WHITE},
  icon: {position: 'absolute', left: 6},
});
