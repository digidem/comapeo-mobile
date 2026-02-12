import {useManyReceivedMapShares} from '@comapeo/core-react';
import React from 'react';
import {Text, View} from 'react-native';

export const MapSharing = () => {
  const mapShares = useManyReceivedMapShares();
  return (
    <View>
      <Text>Map Sharing Screen {mapShares.length}</Text>
    </View>
  );
};
