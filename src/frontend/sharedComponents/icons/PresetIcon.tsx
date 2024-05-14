import * as React from 'react';
import {Image} from 'react-native';

import {Circle} from './Circle';
import {IconSize} from '../../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {useGetPresetIcon} from '../../hooks/server/presets';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface CategoryIconProps {
  size?: IconSize;
  iconId?: string;
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

export const PresetIcon = React.memo<CategoryIconProps>(
  ({size = 'medium', iconId}) => {
    const {data, isLoading} = useGetPresetIcon(iconId);
    const [error, setError] = React.useState(false);
    const iconSize = iconSizes[size] || 35;

    if (isLoading) return <UIActivityIndicator size={30} />;

    // Fallback to a default icon if we can't load the icon from mapeo-server
    if (error || !iconId) return <MaterialIcon name="place" size={iconSize} />;

    return (
      <Image
        style={{width: iconSize, height: iconSize}}
        source={{uri: data}}
        onError={() => setError(true)}
      />
    );
  },
);

export const PresetCircleIcon = ({
  iconId,
  size = 'medium',
}: CategoryIconProps) => {
  // const [{ presets }] = React.useContext(ConfigContext);

  // If the preset defines a "color" field for *any* point-based category
  // we want to render a thicker border, even if not all categories have a color defined
  // const presetsUseColors = Array.from(presets.values()).some(
  //   p => p.geometry.includes("point") && !!p.color
  // );

  return (
    <Circle
      radius={radii[size]}
      style={undefined}
      //style={presetsUseColors ? { borderWidth: 3 } : undefined}
    >
      <PresetIcon iconId={iconId} size={size} />
    </Circle>
  );
};
