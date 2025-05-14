import {useAttachmentUrl} from '@comapeo/core-react';
import {type ComponentProps, useState} from 'react';

import {PhotoVariant} from '../../sharedTypes';
import {GracefulImage} from './GracefulImage';
import {ImageErrorPlaceholder} from './ImageErrorPlaceholder';

type Props = {
  driveId: string;
  name: string;
  projectId: string;
} & Omit<ComponentProps<typeof GracefulImage>, 'renderError' | 'onLoadError'>;

export const CoreBlobImage = ({
  driveId,
  name,
  projectId,
  testID,
  ...otherImageProps
}: Props) => {
  const [displayedVariant, setDisplayedVariant] =
    useState<PhotoVariant>('original');

  const {
    data: attachmentUrl,
    error,
    isRefetching,
  } = useAttachmentUrl({
    projectId,
    blobId: {
      driveId,
      name,
      type: 'photo',
      variant: displayedVariant,
    },
  });

  // May fail to get the URL for the original.
  // Attempt to get the URL for the preview.
  if (displayedVariant === 'original' && error) {
    setDisplayedVariant('preview');
  }

  // Failed to get the URL for the preview. Just show the error at this point.
  if (displayedVariant === 'preview' && error && !isRefetching) {
    return <ImageErrorPlaceholder testID={testID} />;
  }

  return (
    <GracefulImage
      {...otherImageProps}
      onLoadError={() => {
        // The original may fail to load depending on media sync settings.
        // Attempt to use the preview URL if using the original does not work.
        if (displayedVariant === 'original') {
          setDisplayedVariant('preview');
          return true;
        }

        return false;
      }}
      renderError={() => <ImageErrorPlaceholder testID={testID} />}
      src={attachmentUrl}
      testID={testID}
    />
  );
};
