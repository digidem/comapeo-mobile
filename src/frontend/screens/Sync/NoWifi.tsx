import {View, StyleSheet, Linking} from 'react-native';
import {WifiOffIcon} from '../../sharedComponents/icons';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes';

const m = defineMessages({
  noWifiTitle: {
    id: 'screens.SyncModal.SyncView.noWifiTitle',
    defaultMessage: 'No WiFi',
    description: 'Title of message shown when no wifi network',
  },
  noWifiDesc: {
    id: 'screens.SyncModal.SyncView.noWifiDesc',
    description: 'Description shown when no wifi network',
    defaultMessage:
      'Open your phone settings and connect to a WiFi network to synchronize',
  },
  settingsButton: {
    id: 'screens.SyncModal.SyncView.settingsButton',
    description: 'Button to open WiFi settings',
    defaultMessage: 'Open Settings',
  },
  syncHeader: {
    id: 'screens.SyncModal.SyncView.syncHeader',
    defaultMessage: 'Synchronize',
    description: 'Header of sync screen',
  },
});

export const NoWifi: NativeNavigationComponent<'NoWifi'> = () => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.noWifiBox}>
      <View style={styles.noWifiIconContainer}>
        <View style={styles.noWifiIcon}>
          <WifiOffIcon size={150} color="#2347B2" style={{top: 7}} />
        </View>
      </View>
      <View style={styles.noWifiTextContainer}>
        <Text style={[styles.infoHeader, styles.noWifiText]}>
          {t(m.noWifiTitle)}
        </Text>
        <Text style={[styles.infoSubheader, styles.noWifiText]}>
          {t(m.noWifiDesc)}
        </Text>
      </View>
      <View style={styles.settingsButton}>
        <Button onPress={() => Linking.openSettings()}>
          {t(m.settingsButton)}
        </Button>
      </View>
    </View>
  );
};

NoWifi.navTitle = m.syncHeader;

const styles = StyleSheet.create({
  noWifiBox: {
    backgroundColor: '#000034',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
  },
  noWifiIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 0,
  },
  noWifiIcon: {
    width: 250,
    height: 250,
    marginVertical: 50,
    backgroundColor: '#19337F',
    borderRadius: 125,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoHeader: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
  },
  infoSubheader: {
    color: 'white',
    fontWeight: '400',
    fontSize: 18,
  },
  noWifiTextContainer: {
    flex: 0,
    paddingHorizontal: 20,
  },
  noWifiText: {
    textAlign: 'center',
  },
  settingsButton: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
