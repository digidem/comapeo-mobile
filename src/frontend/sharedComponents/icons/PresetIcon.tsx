import React, {memo} from 'react';
import {Image} from 'react-native';
import {Circle} from './Circle';
import {type IconSize} from '../../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {useGetPresetIcon} from '../../hooks/server/presets';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface PresetIconProps {
  presetDocId?: string;
  size: IconSize;
  testID?: string;
}

const iconSizes = {
  small: 22,
  medium: 35,
  large: 50,
};

const radii = {
  small: 15,
  medium: 25,
  large: 35,
};

const PresetIcon = memo<PresetIconProps>(({presetDocId, size, testID}) => {
  const iconSize = iconSizes[size] || 35;

  const {data: iconUrl, isPending, error} = useGetPresetIcon(presetDocId, size);

  if (isPending) return <UIActivityIndicator size={30} />;

  if (error || !iconUrl) {
    return <MaterialIcon name="place" size={iconSize} />;
  }

  return (
    <Image
      style={{width: iconSize, height: iconSize}}
      resizeMode="contain"
      source={{uri: iconUrl}}
      testID={testID}
    />
  );
});

export const PresetCircleIcon = ({
  presetDocId,
  size,
  testID,
}: PresetIconProps) => {
  const iconSize = iconSizes[size] || 35;

  return (
    <Circle radius={radii[size]} style={{elevation: 5}}>
      {presetDocId ? (
        <PresetIcon presetDocId={presetDocId} size={size} testID={testID} />
      ) : (
        <MaterialIcon name="place" size={iconSize} />
      )}
    </Circle>
  );
};
