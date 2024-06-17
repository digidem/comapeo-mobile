import React, {memo} from 'react';
import {Image} from 'react-native';

import {Circle} from './Circle';
import {IconSize} from '../../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {useGetPresetIcon} from '../../hooks/server/presets';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface PresetIconProps {
  size?: IconSize;
  name?: string;
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

export const PresetIcon = memo<PresetIconProps>(({size = 'medium', name}) => {
  const iconSize = iconSizes[size] || 35;
  const {data, isLoading} = useGetPresetIcon(size, name);
  const [error, setError] = React.useState(false);

  if (isLoading) return <UIActivityIndicator size={30} />;

  // Fallback to a default icon if we can't load the icon from mapeo-server
  if (error || !name) return <MaterialIcon name="place" size={iconSize} />;

  return (
    <Image
      style={{width: iconSize, height: iconSize}}
      resizeMode="contain"
      source={{uri: data}}
      onError={() => setError(true)}
      testID={name}
    />
  );
});

export const PresetCircleIcon = ({name, size = 'medium'}: PresetIconProps) => {
  return (
    <Circle radius={radii[size]} style={{elevation: 5}}>
      <PresetIcon name={name} size={size} />
    </Circle>
  );
};
