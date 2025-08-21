import {type ComponentProps, useState} from 'react';

import {ImageErrorPlaceholder} from '../../sharedComponents/Images/ImageErrorPlaceholder';
import {TrulyContainedImage} from '../../sharedComponents/Images/TrulyContainedImage';

export function ImageWithErrorFallback({
  source,
  onLoad,
}: Pick<ComponentProps<typeof TrulyContainedImage>, 'source' | 'onLoad'>) {
  const [loadError, setLoadError] = useState(false);

  if (loadError) {
    return <ImageErrorPlaceholder />;
  }

  return (
    <TrulyContainedImage
      source={source}
      onError={() => {
        setLoadError(true);
      }}
      onLoad={onLoad}
    />
  );
}
