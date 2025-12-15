import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import StackSvg from '../../images/Stack.svg';
import CautionSvg from '../../images/caution.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  BLACK,
  DARK_GREY,
  BLUE_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
  LIGHT_GREEN,
} from '../../lib/styles';

const m = defineMessages({
  sharingDevice: {
    id: 'screens.Settings.MapManagement.MapReceived.sharingDevice',
    defaultMessage: '{deviceName} wants to share a map',
  },
  accept: {
    id: 'screens.Settings.MapManagement.MapReceived.accept',
    defaultMessage: 'Accept',
  },
  decline: {
    id: 'screens.Settings.MapManagement.MapReceived.decline',
    defaultMessage: 'Decline',
  },
  locationNotCovered: {
    id: 'screens.Settings.MapManagement.MapReceived.locationNotCovered',
    defaultMessage: 'Current location not covered!',
  },
  kmAway: {
    id: 'screens.Settings.MapManagement.MapReceived.kmAway',
    defaultMessage: '{distance} km away',
  },
  notEnoughSpace: {
    id: 'screens.Settings.MapManagement.MapReceived.notEnoughSpace',
    defaultMessage: 'Not enough free space!',
  },
  mbNeeded: {
    id: 'screens.Settings.MapManagement.MapReceived.mbNeeded',
    defaultMessage: '{size} MB needed',
  },
});

type WarningType = 'location' | 'space' | null;

export function MapReceivedBottomSheet({
  route,
  navigation,
}: NativeRootNavigationProps<'MapReceivedBottomSheet'>) {
  const {formatMessage: t} = useIntl();
  const {shareId, mapName, deviceName, sizeInBytes} = route.params;

  // TODO: Implement actual location check using turf.js
  // For now, using placeholder values
  const [warning, setWarning] = React.useState<WarningType>(null);
  const [distanceKm, setDistanceKm] = React.useState(0);
  const [mbNeeded, setMbNeeded] = React.useState(0);

  const sizeInMB = Math.round(sizeInBytes / (1024 * 1024));

  const handleAccept = () => {
    // TODO: Navigate to ReplaceBackgroundMapScreen when it's created
    // navigation.navigate('ReplaceBackgroundMapScreen', {shareId});
    console.log('Accept map share:', shareId);
    navigation.goBack();
  };

  const handleDecline = () => {
    // TODO: Call useRequestRejectMapShare when API is ready
    // The API doesn't support rejection reason yet
    console.log('Decline map share:', shareId);
    navigation.goBack();
  };

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <HeaderText variant="header6" style={styles.header}>
          {t(m.sharingDevice, {deviceName})}
        </HeaderText>

        <View style={styles.mapCard}>
          <View style={styles.mapCardContent}>
            <HeaderText variant="header2" style={styles.mapName}>
              {mapName}
            </HeaderText>

            <View style={styles.mapMetadata}>
              <View style={styles.iconRow}>
                <View style={styles.iconContainer}>
                  <StackSvg width={17} height={18} color={DARK_GREY} />
                </View>
                <BodyText style={styles.sizeText}>{sizeInMB} MB</BodyText>
              </View>
            </View>
          </View>
        </View>

        {warning && (
          <View style={styles.warningBox}>
            <CautionSvg width={20} height={20} />
            <View style={styles.warningTextContainer}>
              <BodyText variant="smallMeta">
                {warning === 'location'
                  ? t(m.locationNotCovered)
                  : t(m.notEnoughSpace)}
              </BodyText>
              <BodyText style={styles.warningSubtitle}>
                {warning === 'location'
                  ? t(m.kmAway, {distance: distanceKm.toFixed(1)})
                  : t(m.mbNeeded, {size: mbNeeded})}
              </BodyText>
            </View>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          {warning !== 'space' && (
            <PrimaryButton fullSize text={t(m.accept)} onPress={handleAccept} />
          )}
          <SecondaryButton
            fullSize
            text={t(m.decline)}
            onPress={handleDecline}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 20,
  },
  header: {
    textTransform: 'uppercase',
    color: BLACK,
  },
  mapCard: {
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1,
    borderColor: VERY_LIGHT_GREY,
    borderRadius: 6,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  mapCardContent: {
    padding: 20,
    gap: 20,
  },
  mapName: {
    color: BLACK,
  },
  mapMetadata: {
    gap: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeText: {
    color: NEW_DARK_GREY,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    backgroundColor: BLUE_GREY,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 4,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningSubtitle: {
    color: NEW_DARK_GREY,
  },
  buttonsContainer: {
    gap: 12,
  },
});
