import React from 'react';
import {Image} from 'react-native';
import {Circle} from './Circle';
import {type IconSize} from '../../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {useIconUrl} from '../../hooks/server/presets';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface PresetIconProps {
  iconId?: string;
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

const LoadedPresetIcon = ({
  iconId,
  size,
  testID,
}: PresetIconProps & {iconId: string}) => {
  const iconSize = iconSizes[size];

  const iconUrlQuery = useIconUrl(iconId, size);

  if (iconUrlQuery.status === 'pending')
    return <UIActivityIndicator size={iconSize} />;

  if (iconUrlQuery.status === 'error') {
    return <MaterialIcon name="place" size={iconSize} />;
  }

  return (
    <Image
      style={{width: iconSize, height: iconSize}}
      resizeMode="contain"
      src={iconUrlQuery.data}
      testID={testID}
    />
  );
};

const PresetIcon = ({iconId, size, testID}: PresetIconProps) => {
  return iconId ? (
    <LoadedPresetIcon iconId={iconId} size={size} testID={testID} />
  ) : (
    <MaterialIcon name="place" size={iconSizes[size]} testID={testID} />
  );
};

export const PresetCircleIcon = ({iconId, size, testID}: PresetIconProps) => {
  return (
    <Circle radius={radii[size]} style={{elevation: 5}}>
      <PresetIcon iconId={iconId} size={size} testID={testID} />
    </Circle>
  );
};
