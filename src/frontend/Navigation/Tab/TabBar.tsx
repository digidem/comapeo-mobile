import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ObservationListIcon from '../../images/ObservationList.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useTracking} from '../../hooks/useTracking';
import {useTrackTimerContext} from '../../contexts/TrackTimerContext';

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
        style={styles.buttonStyle}
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
        style={styles.buttonStyle}
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
        style={styles.buttonStyle}
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
        style={styles.trackContainer}
        onPress={onPressTracks}>
        <TrackButtonContent
          isSelected={
            !!(
              currentTab?.name === 'Map' &&
              currentTab?.params &&
              'trackingOpen' in currentTab.params &&
              currentTab.params.trackingOpen === true
            )
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const TrackButtonContent = ({isSelected}: {isSelected: boolean}) => {
  const {isTracking} = useTracking();
  const {timer} = useTrackTimerContext();
  return (
    <>
      {isTracking && (
        <View style={styles.runtimeWrapper}>
          <View style={styles.indicator} />
          <BodyText variant="tinyMeta" style={styles.timer}>
            {timer}
          </BodyText>
        </View>
      )}
      <MaterialIcons
        color={isSelected ? COMAPEO_BLUE : MEDIUM_GREY}
        size={BUTTON_SIZE}
        name="nordic-walking"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  buttonStyle: {
    marginTop: 25,
    marginBottom: 25,
    flex: 1,
    alignItems: 'center',
  },
  runtimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    marginRight: 5,
    height: 10,
    width: 10,
    borderRadius: 99,
    backgroundColor: '#59A553',
  },
  timer: {
    marginLeft: 5,
  },
  trackContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
