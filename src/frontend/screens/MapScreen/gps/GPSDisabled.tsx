import * as React from 'react';
import {View, Image} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';

export const GPSDisabled = () => {
  return (
    <View
      style={{
        padding: 30,
        zIndex: 11,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Image
        source={require('../../../images/alert-icon.png')}
        width={60}
        height={60}
        style={{marginBottom: 30}}
      />

      <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
        GPS Disabled
      </Text>
      <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 30}}>
        To create a Track CoMapeo needs access to your location and GPS.
      </Text>
      <Button
        fullWidth
        onPress={() => console.log('pres')}
        style={{marginBottom: 20, marginVertical: 8.5}}>
        <Text style={{fontWeight: '500', color: '#fff'}}>Enable</Text>
      </Button>
    </View>
  );
};
