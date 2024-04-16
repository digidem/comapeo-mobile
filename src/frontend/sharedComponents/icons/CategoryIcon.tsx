import * as React from 'react';
import {Image} from 'react-native';

import {Circle} from './Circle';
import {IconSize} from '../../sharedTypes';

interface CategoryIconProps {
  size?: IconSize;
  iconId?: string;
}

interface CategoryCircleIconProps extends CategoryIconProps {
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

export const CategoryIcon = React.memo<CategoryIconProps>(
  ({size = 'medium', iconId}) => {
    const [error, setError] = React.useState(false);
    const iconSize = iconSizes[size] || 35;
    // Fallback to a default icon if we can't load the icon from mapeo-server
    // if (error || !iconId) {
    //   return <MaterialIcon name="place" size={iconSize} />;
    // }
    return (
      <Image
        style={{width: iconSize, height: iconSize}}
        source={require('../../images/icon_mapeo_pin.png')}
        onError={() => setError(true)}
      />
    );
  },
);

export const CategoryCircleIcon = ({
  color,
  iconId,
  size = 'medium',
}: CategoryCircleIconProps) => {
  // const [{ presets }] = React.useContext(ConfigContext);

  // If the preset defines a "color" field for *any* point-based category
  // we want to render a thicker border, even if not all categories have a color defined
  // const presetsUseColors = Array.from(presets.values()).some(
  //   p => p.geometry.includes("point") && !!p.color
  // );

  return (
    <Circle
      color={color}
      radius={radii[size]}
      style={undefined}
      //style={presetsUseColors ? { borderWidth: 3 } : undefined}
    >
      <CategoryIcon iconId={iconId} size={size} />
    </Circle>
  );
};
