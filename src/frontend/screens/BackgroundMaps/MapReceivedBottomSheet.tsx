import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import bboxPolygon from '@turf/bbox-polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import pointToPolygonDistance from '@turf/point-to-polygon-distance';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

import StackSvg from '../../images/Stack.svg';
import CautionSvg from '../../images/caution.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useStorageReadingQuery} from '../../hooks/useStorageReadingQuery';
import {useLocationState} from '../../contexts/LocationContext';
import {
  BLACK,
  BLUE_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
  LIGHT_GREEN,
  LIGHT_ORANGE,
} from '../../lib/styles';
import {
  useDeclineReceivedMapShare,
  useDownloadReceivedMapShare,
  useGetCustomMapInfo,
  useSingleReceivedMapShare,
  getErrorCode,
  MapShareErrorCode,
} from '@comapeo/core-react';
import {useUnitSystem} from '../../contexts/UnitSystemStoreContext';
import {kmOrConversion} from '../../lib/unitConversion';
import * as Sentry from '@sentry/react-native';
import {toError} from '../../utils/errors';

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
  distanceAway: {
    id: 'screens.Settings.MapManagement.MapReceived.distanceAway',
    defaultMessage: '{distance} away',
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

export function MapReceivedBottomSheet({
  route,
  navigation,
}: NativeRootNavigationProps<'MapReceivedBottomSheet'>) {
  const {formatMessage: t} = useIntl();
  const unitSystem = useUnitSystem();
  const {shareId} = route.params;
  const mapShare = useSingleReceivedMapShare({shareId});

  const {data: storageData} = useStorageReadingQuery();
  const {freeBytes} = storageData;

  const currentLocation = useLocationState(state => state.location);

  const warningInfo = React.useMemo(() => {
    if (freeBytes < mapShare.estimatedSizeBytes) {
      const mbNeeded = Math.ceil(
        (mapShare.estimatedSizeBytes - freeBytes) / (1024 * 1024),
      );
      return {
        warning: 'space' as const,
        distanceKm: null,
        mbNeeded,
      };
    }

    if (currentLocation?.coords && mapShare.bounds) {
      const userPoint = [
        currentLocation.coords.longitude,
        currentLocation.coords.latitude,
      ];
      const bboxPoly = bboxPolygon([...mapShare.bounds]);
      const isInside = booleanPointInPolygon(userPoint, bboxPoly);
      if (!isInside) {
        const distanceKm = pointToPolygonDistance(userPoint, bboxPoly, {
          units: 'kilometers',
        });

        return {
          warning: 'location' as const,
          distanceKm,
          mbNeeded: 0,
        };
      }
    }

    // per Gregor, if there is no current location, consider the user to be inside the map

    return {
      warning: null,
      distanceKm: null,
      mbNeeded: 0,
    };
  }, [
    freeBytes,
    mapShare.estimatedSizeBytes,
    mapShare.bounds,
    currentLocation,
  ]);

  const {data: customMapInfo, status: customMapStatus} = useGetCustomMapInfo();
  const {mutate: declineMapShare, status: declineStatus} =
    useDeclineReceivedMapShare();
  const {mutate: downloadMapShare} = useDownloadReceivedMapShare();

  const handleAccept = () => {
    if (!mapShare || mapShare.status === 'canceled') {
      navigation.replace('MapShareCanceledBottomSheet');
      return;
    }
    if (customMapStatus === 'success' && customMapInfo) {
      navigation.replace('ReplaceBackgroundMap', {shareId});
      return;
    }
    downloadMapShare(
      {shareId},
      {
        onSuccess: () => {
          navigation.replace('ReceivingBackgroundMap', {shareId});
        },
        onError: (err: unknown) => {
          const error = toError(err, 'Failed to start map download');
          Sentry.captureException(error);
          navigation.replace('BackgroundMapErrorBottomSheet', {
            title: error.message,
            description: error.message,
          });
        },
      },
    );
  };

  const handleDecline = () => {
    if (!mapShare || mapShare.status === 'canceled') {
      navigation.goBack();
    } else {
      const reason =
        warningInfo.warning === 'space' ? 'disk_full' : 'user_rejected';
      declineMapShare(
        {shareId, reason},
        {
          onSuccess: () => {
            navigation.goBack();
          },
          onError: (err: unknown) => {
            if (getErrorCode(err) === MapShareErrorCode.MAP_SHARE_CANCELED) {
              navigation.goBack();
              return;
            }
            Sentry.captureException(err);
            navigation.goBack();
          },
        },
      );
    }
  };

  let warningSubtitle = null;

  if (warningInfo.warning === 'location') {
    const {value: distanceValue, unit: distanceUnit} = kmOrConversion(
      warningInfo.distanceKm ?? 0,
      unitSystem,
    );
    warningSubtitle = t(m.distanceAway, {
      distance: `${distanceValue.toFixed(2)} ${distanceUnit}`,
    });
  } else if (warningInfo.warning === 'space') {
    warningSubtitle = t(m.mbNeeded, {size: warningInfo.mbNeeded});
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <BodyText variant="tinyMeta" style={styles.header}>
          {t(m.sharingDevice, {deviceName: mapShare.senderDeviceName})}
        </BodyText>

        <View style={styles.mapCard}>
          <View style={styles.mapCardContent}>
            <HeaderText variant="header2" style={styles.mapName}>
              {mapShare.mapName}
            </HeaderText>

            <View style={styles.iconRow}>
              <View style={styles.iconContainer}>
                <StackSvg width={17} height={18} color={NEW_DARK_GREY} />
              </View>
              <BodyText style={styles.sizeText}>
                {t(m.megabytes, {
                  size: (mapShare.estimatedSizeBytes / (1024 * 1024)).toFixed(
                    2,
                  ),
                })}
              </BodyText>
            </View>

            {warningInfo.warning && (
              <View style={styles.warningBox}>
                <CautionSvg width={20} height={20} />
                <View style={styles.warningTextContainer}>
                  <BodyText variant="smallMeta">
                    {warningInfo.warning === 'location'
                      ? t(m.locationNotCovered)
                      : t(m.notEnoughSpace)}
                  </BodyText>
                  <BodyText style={styles.warningSubtitle}>
                    {warningSubtitle}
                  </BodyText>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {declineStatus === 'pending' ? (
            <LoadingIndicator size="large" />
          ) : (
            <>
              {warningInfo.warning !== 'space' && (
                <PrimaryButton
                  fullSize
                  text={t(m.accept)}
                  onPress={handleAccept}
                />
              )}

              <SecondaryButton
                fullSize
                text={t(m.decline)}
                onPress={handleDecline}
              />
            </>
          )}
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
    justifyContent: 'center',
    minHeight: 120,
  },
});
