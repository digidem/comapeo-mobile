import {useState} from 'react';
import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from 'expo-image';

/**
 * Wrapper around the Expo's Image component that acts similarly to when `contentFit` is `"contained"`,
 * but works with dynamically sized containers.
 *
 * The rendered image fills the entire width of the containing component and its height is determined based on this width and the source image's aspect ratio.
 * However, this means that the container should NEVER have an explicit `height`, as it will result in the image being cut off.
 */
export function TrulyContainedImage({
  onLoad,
  style,
  ...baseImageProps
}: Omit<ExpoImageProps, 'contentFit'>) {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  return (
    <ExpoImage
      {...baseImageProps}
      contentFit="contain"
      style={[
        style,
        // There seems to be a bug related to images that have non-network sources (e.g. `file://...`)
        // where the loading the image won't even be attempted unless the image has a known height prior.
        // We trigger the load attempt by initially setting the height to a non-zero value and then removing it once it loads.
        // Note: with React Native's image, the initial height can be set to 1 but with Expo's Image, it needs to be a larger value or else
        // there's some layout glitchiness each time it loads...
        {
          aspectRatio,
          height: aspectRatio ? undefined : 50,
        },
      ]}
      onLoad={event => {
        onLoad?.(event);
        setAspectRatio(event.source.width / event.source.height);
      }}
    />
  );
}
