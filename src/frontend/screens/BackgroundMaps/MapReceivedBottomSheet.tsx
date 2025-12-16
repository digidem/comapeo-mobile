import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import bboxPolygon from '@turf/bbox-polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {point} from '@turf/helpers';
import {distance} from '@turf/distance';

import StackSvg from '../../images/Stack.svg';
import CautionSvg from '../../images/caution.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useStorageReadingQuery} from '../../hooks/useStorageReadingQuery';
import {useLocationState} from '../../contexts/LocationContext';
import {useGetCustomMapInfo} from '../../hooks/server/maps';
import {
  BLACK,
  BLUE_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
  LIGHT_GREEN,
  LIGHT_ORANGE,
} from '../../lib/styles';
import {useRejectMapShare} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';

const m = defineMessages({
  sharingDevice: {
    id: 'screens.Settings.MapManagement.MapReceived.sharingDevice',
    defaultMessage: '{deviceName} wants to share...',
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
  megabytes: {
    id: 'screens.Settings.MapManagement.MapReceived.megabytes',
    defaultMessage: '{size} MB',
  },
});

type WarningType = 'location' | 'space' | null;

export function MapReceivedBottomSheet({
  route,
  navigation,
}: NativeRootNavigationProps<'MapReceivedBottomSheet'>) {
  const {formatMessage: t} = useIntl();
  const {shareId, mapName, deviceName, sizeInBytes, testBbox} = route.params;

  const {data: storageData} = useStorageReadingQuery();
  const {freeBytes} = storageData;

  const customMapInfoQuery = useGetCustomMapInfo();
  const hasExistingMap = !!customMapInfoQuery.data;

  const currentLocation = useLocationState(state => state.location);

  const [warning, setWarning] = React.useState<WarningType>(null);
  const [distanceKm, setDistanceKm] = React.useState(0);
  const [mbNeeded, setMbNeeded] = React.useState(0);

  const sizeInMB = Math.round(sizeInBytes / (1024 * 1024));
  const {mutate: rejectMapShare} = useRejectMapShare();

  React.useEffect(() => {
    if (freeBytes < sizeInBytes) {
      const needed = Math.ceil((sizeInBytes - freeBytes) / (1024 * 1024));
      setWarning('space');
      setMbNeeded(needed);
    }
  }, [freeBytes, sizeInBytes]);

  React.useEffect(() => {
    if (warning === 'space') return;

    // TODO: Get the bounding box from the map share API
    // For now, using a placeholder bounding box (or testBbox for testing)
    // Format: [minLng, minLat, maxLng, maxLat]
    // Default: Colombia area
    const bbox: [number, number, number, number] = testBbox || [
      -79.0, -4.0, -66.0, 13.0,
    ];

    if (!currentLocation?.coords) {
      return;
    }

    const userPoint = point([
      currentLocation.coords.longitude,
      currentLocation.coords.latitude,
    ]);

    const bboxPoly = bboxPolygon(bbox);

    const isInside = booleanPointInPolygon(userPoint, bboxPoly);

    if (!isInside) {
      const centerLng = (bbox[0]! + bbox[2]!) / 2;
      const centerLat = (bbox[1]! + bbox[3]!) / 2;
      const centerPoint = point([centerLng, centerLat]);

      const distanceKilometers = distance(userPoint, centerPoint, {
        units: 'kilometers',
      });

      setWarning('location');
      setDistanceKm(distanceKilometers);
    }
  }, [currentLocation, warning, testBbox]);

  const handleAccept = () => {
    if (hasExistingMap) {
      navigation.replace('ReplaceBackgroundMap', {shareId});
    } else {
      navigation.replace('UpdatingBackgroundMap', {shareId});
    }
  };

  const handleDecline = () => {
    // reason?
    rejectMapShare(
      {shareId},
      {
        onSuccess: () => {
          navigation.popTo('BackgroundMaps');
        },
        onError: (err: Error) => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  };

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <BodyText variant="tinyMeta" style={styles.header}>
          {t(m.sharingDevice, {deviceName})}
        </BodyText>

        <View style={styles.mapCard}>
          <View style={styles.mapCardContent}>
            <HeaderText variant="header2" style={styles.mapName}>
              {mapName}
            </HeaderText>

            <View style={styles.iconRow}>
              <View style={styles.iconContainer}>
                <StackSvg width={17} height={18} color={NEW_DARK_GREY} />
              </View>
              <BodyText style={styles.sizeText}>
                {t(m.megabytes, {size: sizeInMB})}
              </BodyText>
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
          </View>
        </View>

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
    gap: 12,
  },
  header: {
    textTransform: 'uppercase',
    color: BLACK,
    fontWeight: '500',
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
    backgroundColor: LIGHT_ORANGE,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 2,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningSubtitle: {
    color: NEW_DARK_GREY,
  },
  buttonsContainer: {
    paddingTop: 8,
    gap: 12,
    alignItems: 'center',
  },
});
