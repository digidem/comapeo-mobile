import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ObservationListIcon from '../../images/ObservationList.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../lib/styles';

const BUTTON_SIZE = 25;
const HIT_SLOP = 20;

export const TabBar = ({navigation, state}: BottomTabBarProps) => {
  const currentIndex = state.index;
  const currentTab = state.routes[currentIndex];

  function onPressMap() {
    navigation.navigate('Map', {trackingOpen: false});
  }

  function onPressTracks() {
    navigation.navigate('Map', {trackingOpen: true});
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        testID="tabBarButtonObservationsList"
        accessibilityLabel="Go to ObservationsList"
        onPress={() => navigation.navigate('ObservationsList')}>
        <ObservationListIcon
          color={
            currentTab?.name === 'ObservationsList' ? COMAPEO_BLUE : MEDIUM_GREY
          }
          stroke={
            currentTab?.name === 'ObservationsList' ? COMAPEO_BLUE : MEDIUM_GREY
          }
          height={BUTTON_SIZE}
        />
      </TouchableOpacity>
      <TouchableOpacity
        testID="tabBarButtonMap"
        accessibilityLabel="Go to Map"
        hitSlop={HIT_SLOP}
        onPress={onPressMap}>
        <MaterialIcons
          color={
            //@ts-expect-error known type
            currentTab?.name === 'Map' && !currentTab?.params?.trackingOpen
              ? COMAPEO_BLUE
              : MEDIUM_GREY
          }
          size={BUTTON_SIZE}
          name="map"
        />
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        testID="tabBarButtonCamera"
        accessibilityLabel="Go to Camera"
        onPress={() => navigation.navigate('Camera')}>
        <MaterialIcons
          color={currentTab?.name === 'Camera' ? COMAPEO_BLUE : MEDIUM_GREY}
          size={BUTTON_SIZE}
          name="photo-camera"
        />
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        testID="tabBarButtonTracking"
        accessibilityLabel="Go to Tracking"
        onPress={onPressTracks}>
        <MaterialIcons
          color={
            currentTab?.name === 'Map' &&
            currentTab?.params &&
            'trackingOpen' in currentTab.params &&
            currentTab.params.trackingOpen === true
              ? COMAPEO_BLUE
              : MEDIUM_GREY
          }
          size={BUTTON_SIZE}
          name="nordic-walking"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
  },
});
