import React from 'react';
import {Image} from 'react-native';
import {Circle} from './Circle';
import {type IconSize} from '../../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {useProjectIconUrl} from '../../hooks/server/icons';
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

  const {data: iconUrl, error, isRefetching} = useProjectIconUrl(iconId, size);

  if (isRefetching) {
    return <UIActivityIndicator size={iconSize} />;
  }

  if (error) {
    return <MaterialIcon name="place" size={iconSize} testID={testID} />;
  }

  return (
    <Image
      style={{width: iconSize, height: iconSize}}
      resizeMode="contain"
      source={{uri: iconUrl}}
      testID={testID}
    />
  );
};

const PresetIcon = ({iconId, size, testID}: PresetIconProps) => {
  if (!iconId) {
    return <MaterialIcon name="place" size={iconSizes[size]} testID={testID} />;
  }

  return <LoadedPresetIcon iconId={iconId} size={size} testID={testID} />;
};

export const PresetCircleIcon = ({iconId, size, testID}: PresetIconProps) => {
  return (
    <Circle radius={radii[size]} style={{elevation: 5}}>
      <PresetIcon iconId={iconId} size={size} testID={testID} />
    </Circle>
  );
};
