import * as React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {defineMessages, useIntl} from 'react-intl';

import {BodyText} from '../Text/BodyText';
import {BLUE_GREY, DARK_ORANGE, NEW_DARK_GREY} from '../../lib/styles';

type Props = {
  onDismiss: () => void;
  testID: string;
};

const m = defineMessages({
  title: {
    id: 'Storage.MapBanner.title',
    defaultMessage: 'Your device has low storage.',
  },
});

export function LowStorageBanner({onDismiss, testID}: Props) {
  const {formatMessage} = useIntl();

  return (
    <View testID={testID} accessibilityRole="alert" style={styles.container}>
      <View style={styles.innerRow}>
        <MaterialIcons name="warning" size={20} color={DARK_ORANGE} />
        <View style={styles.textWrap}>
          <BodyText variant="smallMeta">{formatMessage(m.title)}</BodyText>
        </View>

        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss low storage alert"
          hitSlop={8}
          style={styles.closeHit}>
          <MaterialIcons name="close" size={20} color={NEW_DARK_GREY} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5EB',
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 2,
    padding: 10,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textWrap: {
    flex: 1,
  },
  closeHit: {
    width: 24,
    height: 24,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
});
