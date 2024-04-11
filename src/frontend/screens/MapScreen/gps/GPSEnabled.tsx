import * as React from 'react';
import {View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';

export const GPSEnabled = () => {
  return (
    <View style={{paddingHorizontal: 20, paddingVertical: 30}}>
      <Button fullWidth onPress={() => console.log('pres')}>
        <Text style={{fontWeight: '500', color: '#fff'}}>Start Tracks</Text>
      </Button>
    </View>
  );
};
