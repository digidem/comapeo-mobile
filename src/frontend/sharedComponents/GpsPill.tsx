import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {useIsFocused} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {BLACK, WHITE} from '../lib/styles';
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

interface Props {
  onPress?: () => void;
  precision?: number;
  variant: LocationStatus;
}

export const GpsPill = React.memo<Props>(
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
