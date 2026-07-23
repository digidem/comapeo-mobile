import React from 'react';
import {Image} from 'expo-image';
import {Circle} from './Circle';
import {type IconSize} from '../../sharedTypes';
import {LoadingIndicator} from '../LoadingIndicator';
import {useProjectIconUrl} from '../../hooks/server/icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';
interface PresetIconProps {
  iconId?: string;
  size: IconSize;
  testID?: string;
  color?: string;
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
  const [iconType, setIconType] = React.useState<'svg' | 'png'>('svg');

  const {
    data: iconUrl,
    error,
    isRefetching,
  } = useProjectIconUrl(iconId, iconType);

  if (isRefetching) {
    return <LoadingIndicator size={size === 'small' ? 'small' : 'large'} />;
  }

  if (error) {
    return <MaterialIcon name="place" size={iconSize} testID={testID} />;
  }

  return (
    <Image
      style={{width: iconSize, height: iconSize}}
      resizeMode="contain"
      source={iconUrl}
      testID={testID}
      onError={() => {
        if (iconType === 'svg') {
          // Retry as PNG if SVG fails to load
          setIconType('png');
        }
      }}
    />
  );
};

const PresetIcon = ({iconId, size, testID}: PresetIconProps) => {
  if (!iconId) {
    return <MaterialIcon name="place" size={iconSizes[size]} testID={testID} />;
  }

  return <LoadedPresetIcon iconId={iconId} size={size} testID={testID} />;
};

export const PresetCircleIcon = ({
  iconId,
  size,
  testID,
  color,
}: PresetIconProps) => {
  return (
    <Circle
      radius={radii[size]}
      style={{elevation: 5, borderWidth: 3}}
      color={color}>
      <PresetIcon iconId={iconId} size={size} testID={testID} />
    </Circle>
  );
};
