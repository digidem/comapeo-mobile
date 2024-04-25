import {StyleSheet, View} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';
import {defineMessages, useIntl} from 'react-intl';

import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {Circle} from '../../sharedComponents/icons/Circle';
import {WifiIcon, WifiOffIcon} from '../../sharedComponents/icons';
import {Text} from '../../sharedComponents/Text';
import {COMAPEO_DARK_BLUE, WHITE} from '../../lib/styles';

const m = defineMessages({
  noWiFi: {
    id: 'screens.Sync.HeaderTitle.noWiFi',
    defaultMessage: 'No WiFi',
  },
});

export function HeaderTitle() {
  const {formatMessage: t} = useIntl();
  const screenWidth = useDimensions().screen.width;
  const ssid = useLocalDiscoveryState(state => state.ssid);

  const WifiIconComponent = ssid ? WifiIcon : WifiOffIcon;

  return (
    <View
      style={[
        styles.container,
        // Hacky way of accounting for dynamic title size since there seems to be some
        // difficulties with getting desired flex overflow behavior
        // https://github.com/software-mansion/react-native-screens/issues/1946
        {maxWidth: screenWidth * 0.5},
      ]}>
      <Circle
        color={COMAPEO_DARK_BLUE}
        radius={14}
        style={styles.signalIndicator}>
        <WifiIconComponent size={16} color={WHITE} />
      </Circle>
      <Text numberOfLines={1} style={[styles.wifiText]}>
        {ssid || t(m.noWiFi)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  signalIndicator: {
    elevation: 0,
    backgroundColor: COMAPEO_DARK_BLUE,
  },
  wifiText: {
    fontWeight: 'bold',
  },
});
