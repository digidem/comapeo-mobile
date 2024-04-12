import * as React from 'react';
import {View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';
import {useTracking} from '../../../hooks/tracks/useTracking';
import {useTracksStore} from '../../../hooks/tracks/useTracksStore';

export const GPSEnabled = () => {
  const tracking = useTracking();
  return (
    <View style={{paddingHorizontal: 20, paddingVertical: 30}}>
      <Button
        fullWidth
        onPress={() => {
          tracking.isTracking
            ? tracking.cancelTracking()
            : tracking.startTracking();
        }}>
        <Text style={{fontWeight: '500', color: '#fff'}}>
          {tracking.isTracking ? 'Stop Tracks' : 'Start Tracks'}
        </Text>
      </Button>
    </View>
  );
};
