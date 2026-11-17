import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import {FULL_SIZE_BUTTON_WIDTH} from '../../../constants';
import {VERY_LIGHT_GREY} from '../../../lib/styles';
import {buttonStyles} from '../../../sharedComponents/Buttons';
import {LoadingIndicator} from '../../../sharedComponents/LoadingIndicator';
import {TrackStatusLabel} from './TrackStatusLabel';

const m = defineMessages({
  waitingForPosition: {
    id: '$1TrackBottomSheet.WaitingForPosition.waitingForPosition',
    defaultMessage: 'Waiting for position…',
  },
});

export const WaitingForPosition = () => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container} testID="TRACK.waiting-for-position">
      <TrackStatusLabel
        renderIcon={({color, size}) => (
          <MaterialIcons name="satellite-alt" size={size} color={color} />
        )}
        text={formatMessage(m.waitingForPosition)}
      />
      <View style={[buttonStyles.base, styles.pill]}>
        <LoadingIndicator size="small" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  pill: {
    backgroundColor: VERY_LIGHT_GREY,
    width: FULL_SIZE_BUTTON_WIDTH,
  },
});
