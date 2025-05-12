import {useAttachmentUrl} from '@comapeo/core-react';
import {type ComponentProps, useState} from 'react';
import {Image, View} from 'react-native';

import {LIGHT_GREY} from '../lib/styles';
import {PhotoVariant} from '../sharedTypes';
import {AlertIcon} from './icons';
import {TrulyContainedImage} from './TrulyContainedImage';

type Props = {
  driveId: string;
  name: string;
  projectId: string;
} & Pick<ComponentProps<typeof Image>, 'alt' | 'testID'>;

export const CoreBlobImage = ({
  alt,
  driveId,
  name,
  projectId,
  testID,
}: Props) => {
  const [displayedVariant, setDisplayedVariant] =
    useState<PhotoVariant>('original');

  const [cannotLoad, setCannotLoad] = useState(false);

  const {data: attachmentUrl, error} = useAttachmentUrl({
    projectId,
    blobId: {
      driveId,
      name,
      type: 'photo',
      variant: displayedVariant,
    },
  });

  // May fail to build the URL for the original.
  // Attempt to get the URL for the preview.
  if (displayedVariant === 'original' && error) {
    setDisplayedVariant('preview');
  }

  const shouldDisplayErrorState =
    cannotLoad || (displayedVariant === 'preview' && error);

  return (
    <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
      {shouldDisplayErrorState ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: LIGHT_GREY,
            aspectRatio: 1,
          }}>
          <AlertIcon testID={testID} size={96} />
        </View>
      ) : (
        <TrulyContainedImage
          alt={alt}
          testID={testID}
          src={attachmentUrl}
          onError={() => {
            // The original may fail to load depending on media sync settings.
            // Attempt to use the preview URL if using the original does not work.
            if (displayedVariant === 'original') {
              setDisplayedVariant('preview');
              return;
            }

            setCannotLoad(true);
          }}
        />
      )}
    </View>
  );
};
