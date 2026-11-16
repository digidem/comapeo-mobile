import {useManyReceivedMapShares} from '@comapeo/core-react';
import {useEffect} from 'react';
import {isEditingScreen, isMapShareScreen} from '../lib/screenNameChecks';

export const PendingMapSharesListener = ({
  currentRouteName,
  navigateToMapShareScreen,
}: {
  currentRouteName: string | undefined;
  navigateToMapShareScreen: (shareId: string) => void;
}) => {
  const mapShares = useManyReceivedMapShares();

  useEffect(() => {
    const pendingShare = mapShares.find(share => share.status === 'pending');
    if (!pendingShare || !currentRouteName) return;

    if (isMapShareScreen(currentRouteName)) return;

    if (isEditingScreen(currentRouteName)) return;

    navigateToMapShareScreen(pendingShare.shareId);
  }, [mapShares, currentRouteName, navigateToMapShareScreen]);

  return null;
};
