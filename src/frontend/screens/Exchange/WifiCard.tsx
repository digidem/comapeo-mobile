import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Circle} from '../../sharedComponents/icons/Circle';
import {WifiIcon, WifiOffIcon} from '../../sharedComponents/icons';
import {BLACK, BLUE_GREY, WHITE} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';

type Props = {
  ssid?: string | null;
};

const m = defineMessages({
  noWifi: {
    id: 'screens.Exchange.WifiCard.noWifi',
    defaultMessage: 'No Wi-Fi',
  },
});

export const WifiCard = ({ssid}: Props) => {
  const Icon = ssid ? WifiIcon : WifiOffIcon;
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Circle color="#CCE0FF" radius={14} style={styles.signalIndicator}>
          <Icon
            size={16}
            color={BLACK}
            testID={ssid ? 'wifi-icon' : 'no-wifi-icon'}
          />
        </Circle>
        <View style={styles.textContainer}>
          {ssid ? (
            <BodyText style={styles.wifiName}>{ssid}</BodyText>
          ) : (
            <>
              <BodyText>--</BodyText>
              <BodyText style={styles.wifiName}>{t(m.noWifi)}</BodyText>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
    width: '100%',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
    gap: 10,
  },
  textContainer: {
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: 'auto',
    maxWidth: '80%',
  },
  wifiName: {
    fontWeight: '500',
  },
  signalIndicator: {
    elevation: 0,
    backgroundColor: '#CCE0FF',
    borderColor: '#CCE0FF',
  },
});
