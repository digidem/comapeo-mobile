import React, {memo, useState, useEffect} from 'react';
import {Image} from 'react-native';
import {Circle} from './Circle';
import {IconSize} from '../../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {useGetPresetIconFromPreset} from '../../hooks/server/presets';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {PresetValue} from '@mapeo/schema';

interface PresetIconProps {
  preset?: PresetValue;
  size?: IconSize;
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

export const PresetIcon = memo<PresetIconProps>(
  ({preset, size = 'medium', testID}) => {
    const iconSize = iconSizes[size] || 35;
    if (!preset) {
      return <MaterialIcon name="place" size={iconSize} />;
    }
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const {data, isLoading, error} = useGetPresetIconFromPreset(preset!, size);
    useEffect(() => {
      if (data && !iconUrl) {
        setIconUrl(data);
      }
    }, [data]);
    if (isLoading && !iconUrl) return <UIActivityIndicator size={30} />;

    if (error || !iconUrl) {
      return <MaterialIcon name="place" size={iconSize} />;
    }

    return (
      <Image
        style={{width: iconSize, height: iconSize}}
        resizeMode="contain"
        source={{uri: iconUrl}}
        onError={() => setIconUrl(null)}
        testID={testID}
      />
    );
  },
);

export const PresetCircleIcon = ({
  preset,
  size = 'medium',
  testID,
}: PresetIconProps) => {
  return (
    <Circle radius={radii[size]} style={{elevation: 5}}>
      <PresetIcon preset={preset} size={size} testID={testID} />
    </Circle>
  );
};
