import React, {memo, useState, useEffect} from 'react';
import {Image} from 'react-native';
import {Circle} from './Circle';
import {IconSize} from '../../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {useGetPresetIcon} from '../../hooks/server/presets';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface PresetIconProps {
  presetDocId?: string;
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
  ({presetDocId, size = 'medium', testID}) => {
    const iconSize = iconSizes[size] || 35;
    if (!presetDocId) {
      return <MaterialIcon name="place" size={iconSize} />;
    }
    const {
      data: iconUrl,
      isLoading,
      error,
    } = useGetPresetIcon(presetDocId, size);
    if (isLoading && !iconUrl) return <UIActivityIndicator size={30} />;

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
  },
);

export const PresetCircleIcon = ({
  presetDocId,
  size = 'medium',
  testID,
}: PresetIconProps) => {
  return (
    <Circle radius={radii[size]} style={{elevation: 5}}>
      <PresetIcon presetDocId={presetDocId} size={size} testID={testID} />
    </Circle>
  );
};
