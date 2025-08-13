import * as React from 'react';
import {View, StyleSheet, Pressable, Linking} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {BodyText} from '../Text/BodyText';
import {BLACK, DARK_ORANGE, BLUE_GREY, COMAPEO_BLUE} from '../../lib/styles';
import {HeaderText} from '../Text/HeaderText';
import {Bar} from 'react-native-progress';

export type MenuLowStorageAlertProps = {
  freeBytes: number | null;
  percentUsed: number;
};

const m = defineMessages({
  title: {
    id: 'Storage.MenuAlert.title',
    defaultMessage: 'Your device has low storage.',
  },
  subtitle: {
    id: 'Storage.MenuAlert.subtitle',
    defaultMessage: 'Some features may stop working.',
  },
  onlyLeft: {
    id: 'Storage.MenuAlert.onlyLeft',
    defaultMessage: 'Only {free}mb left on your device',
  },
  cta: {
    id: 'Storage.MenuAlert.cta',
    defaultMessage: 'Free up space',
  },
});

export function MenuLowStorageAlert({
  freeBytes,
  percentUsed,
}: MenuLowStorageAlertProps) {
  const {formatMessage} = useIntl();
  const pct = Math.min(100, Math.max(0, Math.round(percentUsed)));
  const progress = Math.max(0.00000001, Math.min(1, pct / 100));
  const free =
    !freeBytes || freeBytes < 0
      ? 0
      : Math.max(0, Math.floor(freeBytes / (1024 * 1024)));

  return (
    <View
      testID="MENU.low-storage-alert"
      style={styles.container}
      accessibilityRole="alert">
      <View style={styles.headerRow}>
        <MaterialIcons name="warning" size={20} color={DARK_ORANGE} />
        <View style={styles.headerTextWrap}>
          <BodyText variant="smallMeta" style={styles.title}>
            {formatMessage(m.title)}
          </BodyText>
          <BodyText variant="smallMeta">{formatMessage(m.subtitle)}</BodyText>
        </View>
      </View>

      <View style={styles.detailsColumn}>
        <BodyText variant="tinyMeta" style={styles.onlyLeft}>
          {formatMessage(m.onlyLeft, {free})}
        </BodyText>

        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityValue={{now: pct, min: 0, max: 100}}
          accessibilityLabel={formatMessage(m.onlyLeft, {free})}
          style={styles.progressWrap}>
          <Bar
            progress={progress}
            width={null}
            height={10}
            color={DARK_ORANGE}
            unfilledColor={BLUE_GREY}
            borderRadius={20}
            borderWidth={0}
            style={{flex: 1}}
          />
        </View>

        <Pressable
          onPress={() => Linking.openSettings()}
          accessibilityRole="button"
          hitSlop={8}>
          <HeaderText variant="header6" style={styles.actiontext}>
            {formatMessage(m.cta)}
          </HeaderText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    backgroundColor: '#FFF5EB',
    padding: 12,
    flex: 1,
    gap: 12,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerTextWrap: {flex: 1},
  title: {fontWeight: '700'},
  detailsColumn: {
    paddingLeft: 30,
    flexDirection: 'column',
    gap: 6,
  },
  onlyLeft: {color: BLACK},
  progressWrap: {width: '100%'},
  actiontext: {color: COMAPEO_BLUE},
});
