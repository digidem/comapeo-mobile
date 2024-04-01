import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {useIsFocused} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useForegroundPermissions} from 'expo-location';

import {BLACK, WHITE} from '../lib/styles';
import {useLocationProviderStatus} from '../hooks/useLocationProviderStatus';
import {useLocation} from '../hooks/useLocation';
import {getLocationStatus} from '../lib/utils';
import type {LocationStatus} from '../lib/utils';
import {Text} from './Text';
import {GpsIcon} from './icons';

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

type Props = {
  onPress?: () => void;
  precision?: number;
  variant: LocationStatus;
};

const MemoizedGpsPill = React.memo<Props>(
  ({onPress, variant, precision}: Props) => {
    const isFocused = useIsFocused();
    const {formatMessage: t} = useIntl();
    let text: string;
    if (variant === 'error') text = t(m.noGps);
    else if (variant === 'searching' || typeof precision === 'undefined')
      text = t(m.searching);
    else text = `± ${precision} m`;
    return (
      <TouchableOpacity onPress={onPress || undefined} testID="gpsPillButton">
        <View
          style={[
            styles.container,
            variant === 'error' ? styles.error : undefined,
          ]}>
          <View style={styles.icon}>
            {isFocused && <GpsIcon variant={variant} />}
          </View>
          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

export const GpsPill = ({onPress}: Pick<Props, 'onPress'>) => {
  const locationState = useLocation({maxDistanceInterval: 15});
  const [permissions] = useForegroundPermissions();
  const locationProviderStatus = useLocationProviderStatus();

  const precision = locationState?.location?.coords.accuracy;

  const locationStatus =
    !!locationState.error || !permissions?.granted
      ? 'error'
      : getLocationStatus({
          location: locationState.location,
          providerStatus: locationProviderStatus,
        });

  return (
    <MemoizedGpsPill
      onPress={onPress}
      precision={
        typeof precision === 'number' ? Math.round(precision) : undefined
      }
      variant={locationStatus}
    />
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
