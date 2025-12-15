import {useManyMapShares} from '@comapeo/core-react';
import {useEffect} from 'react';
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
  navigateToMapShareScreen: (
    shareId: string,
    mapName: string,
    deviceName: string,
    sizeInBytes: number,
  ) => void;
}) => {
  // TODO: When API is ready, replace useManyMapShares with useReceivedMapShares
  const {data: mapShares} = useManyMapShares();

  useEffect(() => {
    const pendingShare = mapShares.find(
      share => share.state === 'pending' && share.role === 'receiver',
    );

    if (!pendingShare || !currentRouteName) return;

    // If user is already interacting with a map share, do nothing
    if (isMapShareScreen(currentRouteName)) return;

    // Don't interrupt editing screens
    if (isEditingScreen(currentRouteName)) return;

    // TODO: Get actual map name and device name from the API
    // For now using placeholder values
    const mapName = pendingShare.mapId || 'Custom Map';
    const deviceName = pendingShare.deviceId.slice(0, 8);
    const sizeInBytes = 33 * 1024 * 1024; // Placeholder: 33 MB

    navigateToMapShareScreen(
      pendingShare.shareId,
      mapName,
      deviceName,
      sizeInBytes,
    );
  }, [mapShares, currentRouteName, navigateToMapShareScreen]);

  return null;
};
