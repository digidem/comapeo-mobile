import {ComponentProps, useState} from 'react';
import {ImageErrorEventData, NativeSyntheticEvent} from 'react-native';

import {TrulyContainedImage} from './TrulyContainedImage';

/**
 * Wrapper around `TrulyContainedImage` that provides facilities for handling image loading errors.
 */
export function GracefulImage({
  onLoadError,
  renderError,
  ...imageProps
}: {
  /**
   * @returns Whether the error is handled or not.
   */
  onLoadError?: (event: NativeSyntheticEvent<ImageErrorEventData>) => boolean;
  renderError: (imageError: unknown) => JSX.Element;
} & Omit<ComponentProps<typeof TrulyContainedImage>, 'onError'>) {
  const [loadError, setLoadError] = useState(false);

  if (loadError) {
    return renderError(loadError);
  }

  return (
    <TrulyContainedImage
      {...imageProps}
      onError={event => {
        const handled = !!onLoadError?.(event);
        if (handled) return;
        setLoadError(true);
      }}
    />
  );
}
