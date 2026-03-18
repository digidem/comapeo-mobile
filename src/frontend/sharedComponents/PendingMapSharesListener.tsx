import {useManyReceivedMapShares} from '@comapeo/core-react';
import {useEffect} from 'react';
import {isEditingScreen, isMapShareScreen} from '../lib/screenNameChecks';

export const PendingMapSharesListener = ({
  currentRouteName,
  navigationStackLength,
  navigateToMapShareScreen,
}: {
  currentRouteName: string | undefined;
  navigationStackLength: number;
  navigateToMapShareScreen: (shareId: string) => void;
}) => {
  const mapShares = useManyReceivedMapShares();

  useEffect(() => {
    const pendingShare = mapShares.find(share => share.status === 'pending');
    if (!pendingShare || !currentRouteName) return;

    if (isMapShareScreen(currentRouteName)) return;

    if (isEditingScreen(currentRouteName)) return;

    // Only show map share bottom sheet if there's at least one screen in the nav stack
    // This ensures goBack() will always work
    if (navigationStackLength < 1) return;

    navigateToMapShareScreen(pendingShare.shareId);
  }, [
    mapShares,
    currentRouteName,
    navigationStackLength,
    navigateToMapShareScreen,
  ]);

  return null;
};
