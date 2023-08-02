import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

export const Home = ({navigation}) => {

    return(
        <View onTouchEnd={()=>navigation.navigate("ObservationsList")}>
            <Text> This is the home screen </Text>
        </View>
    )
}