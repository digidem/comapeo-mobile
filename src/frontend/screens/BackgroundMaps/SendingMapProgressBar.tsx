import {Bar as ProgressBar} from 'react-native-progress';
import {COMAPEO_BLUE, VERY_LIGHT_GREY, WHITE} from '../../lib/styles';
import {useSingleSentMapShare} from '@comapeo/core-react';

type SendingMapProgressBarProps = {
  shareId: string;
};

/**
 * Progress bar for sending a map share.
 *
 * Anti pattern note. This component fetches mapShare data internally rather than
 * receiving it as a prop. This is intentional to isolate frequent re-renders
 * (which occur on every byte uploaded) to only this small component, preventing
 * "Maximum update depth exceeded" errors that would occur if the parent component
 * re-rendered on every update.
 */
export function SendingMapProgressBar({shareId}: SendingMapProgressBarProps) {
  const mapShare = useSingleSentMapShare({shareId});
  const isSending = mapShare.status === 'downloading';
  const progress = isSending
    ? Math.min(mapShare.bytesDownloaded / mapShare.estimatedSizeBytes, 1)
    : 0;

  return (
    <ProgressBar
      {...(isSending
        ? {progress, indeterminate: false}
        : {indeterminate: true, indeterminateAnimationDuration: 2000})}
      width={250}
      height={8}
      borderRadius={0}
      color={COMAPEO_BLUE}
      unfilledColor={VERY_LIGHT_GREY}
      borderWidth={0}
      borderColor={WHITE}
    />
  );
}
