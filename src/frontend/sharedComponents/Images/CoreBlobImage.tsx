import {useAttachmentUrl} from '@comapeo/core-react';
import {type ComponentProps, useState} from 'react';

import {type PhotoVariant} from '../../sharedTypes';
import {ImageErrorPlaceholder} from './ImageErrorPlaceholder';
import {TrulyContainedImage} from './TrulyContainedImage';

type Props = {
  driveId: string;
  name: string;
  projectId: string;
} & Pick<ComponentProps<typeof TrulyContainedImage>, 'testID'>;

export function CoreBlobImage({driveId, name, projectId, testID}: Props) {
  const [cannotLoadImage, setCannotLoadImage] = useState(false);
  const [displayedVariant, setDisplayedVariant] =
    useState<PhotoVariant>('original');

  const {data: attachmentUrl} = useAttachmentUrl({
    projectId,
    blobId: {
      driveId,
      name,
      type: 'photo',
      variant: displayedVariant,
    },
  });

  if (cannotLoadImage) {
    return <ImageErrorPlaceholder testID={testID} />;
  }

  return (
    <TrulyContainedImage
      src={attachmentUrl}
      onError={() => {
        // The original may fail to load depending on media sync settings.
        // Attempt to use the preview URL if using the original does not work.
        if (displayedVariant === 'original') {
          setDisplayedVariant('preview');
          return;
        }

        setCannotLoadImage(true);
      }}
    />
  );
}
