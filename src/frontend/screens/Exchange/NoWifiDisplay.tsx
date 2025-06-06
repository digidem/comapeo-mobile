import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {BLACK, BLUE_GREY, WARNING_RED, WHITE} from '../../lib/styles';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {Circle} from '../../sharedComponents/icons/Circle';
import {WifiIcon, WifiOffIcon} from '../../sharedComponents/icons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  title: {
    id: 'screens.Sync.NoWifiDisplay.title',
    defaultMessage: 'No Wi-Fi.',
  },
  description: {
    id: 'screens.Sync.NoWifiDisplay.description',
    defaultMessage: 'Check device’s settings and connectivity.',
  },
  buttonText: {
    id: 'screens.Sync.NoWifiDisplay.buttonText',
    defaultMessage: 'Close',
  },
});

export const NoWifiDisplay = ({onGoBack}: {onGoBack: () => void}) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={
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
            <BodyText style={styles.wifiName}>--</BodyText>
          </View>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.projectInfoContainer}>
          <View style={styles.syncStatusIconWrapper}>
            <View style={styles.syncStatusCircleOffline}>
              <WifiOffIcon size={28} color={BLACK} />
            </View>
            <Circle
              radius={14}
              color={WARNING_RED}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                backgroundColor: WARNING_RED,
              }}>
              <HeaderText variant="header4" style={{color: WHITE}}>
                !
              </HeaderText>
            </Circle>
          </View>
        </View>

        <View style={styles.exchangeSettingsCard}>
          <HeaderText variant="header2" style={{textAlign: 'center'}}>
            {t(m.title)}
          </HeaderText>
          <View style={{height: 165}} />
          <HeaderText
            variant="header6"
            style={{
              textAlign: 'center',
              marginBottom: 40,
              paddingHorizontal: 30,
            }}>
            {t(m.description)}
          </HeaderText>
        </View>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
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
    flexGrow: 0,
    flexBasis: 'auto',
    maxWidth: '80%',
  },
  wifiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
    gap: 10,
  },
  wifiName: {
    fontWeight: '500',
  },
  projectInfoContainer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 35,
    paddingBottom: 40,
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
  contentWrapper: {
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});
