import {useState} from 'react';
import {Image, type ImageProps} from 'react-native';

type Props = Omit<
  ImageProps,
  // Resize mode has no effect.
  | 'resizeMode'
  // Dimensions are dictated by the container that lives in the consuming component.
  | 'height'
  | 'width'
>;

/**
 * Wrapper around the native Image component that acts similarly to when `resizeMode` is `"contained"`,
 * but works with dynamically sized containers.
 *
 * The rendered image fills the entire width of the containing component and its height is determined based on this width and the source image's aspect ratio.
 * However, this means that the container should NEVER have an explicit `height`, as it will result in the image being cut off.
 */
export function TrulyContainedImage({onLoad, style, ...baseImageProps}: Props) {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  return (
    <Image
      {...baseImageProps}
      resizeMode="contain"
      style={[
        style,
        // There seems to be a bug related to images that have non-network sources (e.g. `file://...`)
        // where the loading the image won't even be attempted unless the image has a known height prior.
        // We trigger the load attempt by initially setting the height to a non-zero value and then removing it once it loads.
        {aspectRatio, height: aspectRatio ? undefined : 1},
      ]}
      onLoad={event => {
        onLoad?.(event);
        setAspectRatio(
          event.nativeEvent.source.width / event.nativeEvent.source.height,
        );
      }}
    />
  );
}
