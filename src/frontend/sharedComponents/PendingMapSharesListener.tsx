import {useManyMapShares, useOwnDeviceInfo} from '@comapeo/core-react';
import {useEffect, useRef} from 'react';
import {isEditingScreen} from '../lib/screenNameChecks';

const isMapShareScreen = (screenName: string) => {
  return (
    screenName === 'MapReceivedBottomSheet' ||
    screenName === 'ReplaceBackgroundMapScreen'
  );
};

export const PendingMapSharesListener = ({
  currentRouteName,
  navigateToMapShareScreen,
}: {
  currentRouteName: string | undefined;
  navigateToMapShareScreen: (shareId: string) => void;
}) => {
  // TODO: When API is ready, replace useManyMapShares with useReceivedMapShares and then won't need to check for sending device id
  const {data: mapShares} = useManyMapShares();
  const {data: ownDeviceInfo} = useOwnDeviceInfo();

  const shownSharesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!ownDeviceInfo) return;
    const receivedShares = mapShares.filter(
      share => share.senderDeviceId !== ownDeviceInfo.deviceId,
    );

    const pendingShare = receivedShares.find(
      share => share.state === 'pending',
    );

    console.log(
      'PendingMapSharesListener checking pending shares ...',
      pendingShare,
    );

    if (!pendingShare || !currentRouteName) return;

    // hopefully temporary code because right now the api is not updating from pending to accepted/rejected
    if (shownSharesRef.current.has(pendingShare.shareId)) {
      return;
    }

    console.log('Current route name:', currentRouteName);

    // If user is already interacting with a map share, do nothing
    if (isMapShareScreen(currentRouteName)) return;

    // Don't interrupt editing screens
    if (isEditingScreen(currentRouteName)) return;

    shownSharesRef.current.add(pendingShare.shareId);
    navigateToMapShareScreen(pendingShare.shareId);
  }, [mapShares, currentRouteName, navigateToMapShareScreen, ownDeviceInfo]);

  return null;
};
