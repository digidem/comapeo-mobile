import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {BLACK, BLUE_GREY, WARNING_RED, WHITE} from '../../lib/styles';
import {ScreenContentWithButtonDock} from '../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDock';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {Circle} from '../../sharedComponents/icons/Circle';
import {WifiIcon, WifiOffIcon} from '../../sharedComponents/icons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import MaterialIcon from '@react-native-vector-icons/material-icons';

const m = defineMessages({
  title: {
    id: '$1screens.Sync.NoWifiDisplay.title',
    defaultMessage: 'No Wi-Fi.',
  },
  description: {
    id: 'screens.Sync.NoWifiDisplay.description',
    defaultMessage: 'Check device’s settings and connectivity.',
  },
  buttonText: {
    id: '$1screens.Sync.NoWifiDisplay.buttonText',
    defaultMessage: 'Close',
  },
});

export const NoWifiDisplay = ({onGoBack}: {onGoBack: () => void}) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithButtonDock
      contentContainerStyle={{gap: 10}}
      bottomButton={
        <SecondaryButton
          fullSize
          text={t(m.buttonText)}
          onPress={() => onGoBack()}
        />
      }>
      <View style={styles.wifiCard}>
        <View style={styles.wifiCardContent}>
          <Circle color={BLUE_GREY} radius={14} style={styles.signalIndicator}>
            <WifiIcon size={16} color={WHITE} />
          </Circle>
          <View style={styles.wifiCardTextContainer}>
            <BodyText weight={500}>--</BodyText>
          </View>
        </View>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: BLUE_GREY,
          borderRadius: 10,
          paddingTop: 40,
          paddingBottom: 40,
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        <View>
          <View style={styles.projectInfoContainer}>
            <View style={styles.syncStatusIconWrapper}>
              <View style={styles.syncStatusCircleOffline}>
                <WifiOffIcon size={28} color={BLACK} />
              </View>
              <MaterialIcon
                name="error"
                size={28}
                color={WARNING_RED}
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  borderRadius: 14,
                }}
              />
            </View>
          </View>
          <HeaderText
            variant="header2"
            style={{textAlign: 'center', marginTop: 34}}>
            {t(m.title)}
          </HeaderText>
        </View>
        <HeaderText
          variant="header6"
          style={{
            textAlign: 'center',
            paddingHorizontal: 30,
          }}>
          {t(m.description)}
        </HeaderText>
      </View>
    </ScreenContentWithButtonDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
  },
  wifiCard: {
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
  wifiCardTextContainer: {
    flexShrink: 1,
  },
  wifiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 40,
  },
  projectInfoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  signalIndicator: {
    elevation: 0,
    backgroundColor: BLUE_GREY,
    borderColor: BLUE_GREY,
  },
  syncStatusIconWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncStatusCircleOffline: {
    width: 80,
    height: 80,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    elevation: 4,
  },
  exchangeSettingsCard: {
    marginTop: 25,
    alignItems: 'center',
  },
});
