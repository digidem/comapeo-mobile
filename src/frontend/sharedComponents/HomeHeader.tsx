import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton} from './IconButton';
import {ObservationListIcon, SyncIconCircle} from './icons';
import {GPSPill} from './GPSPill';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';

export const HomeHeader: FC<BottomTabHeaderProps> = ({navigation}) => {
  return (
    <View style={[styles.header]}>
      <LinearGradient
        style={styles.linearGradient}
        colors={['#0006', '#0000']}
      />
      <IconButton
        style={styles.leftButton}
        onPress={() => {
          navigation.navigate('Sync');
        }}>
        <SyncIconCircle />
      </IconButton>
      <GPSPill navigation={navigation} />
      <IconButton onPress={() => {}} testID="observationListButton">
        <ObservationListIcon />
      </IconButton>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  leftButton: {
    width: 60,
    height: 60,
  },
  linearGradient: {
    height: 60,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
});
