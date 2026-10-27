import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import NotebookPenIcon from '../../images/NotebookPen.svg';
import TracksIcon from '../../images/Tracks.svg';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useTracking} from '../../hooks/useTracking';
import {useTrackTimer} from '../../hooks/useTrackTimer.ts';
import {usePaddingWithSafeArea} from '../../hooks/usePaddingWithSafeArea.tsx';

const BUTTON_SIZE = 25;
const HIT_SLOP = 20;

export const TabBar = ({navigation, state}: BottomTabBarProps) => {
  const currentIndex = state.index;
  const currentTab = state.routes[currentIndex];
  const {bottom} = usePaddingWithSafeArea();

  function onPressMap() {
    navigation.navigate('Map', {trackingOpen: false});
  }

  function onPressTracks() {
    navigation.navigate('Map', {trackingOpen: true});
  }
  return (
    <View style={[styles.container, {paddingBottom: bottom}]}>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        testID="tabBarButtonObservationsList"
        accessibilityLabel="Go to observations list."
        style={styles.buttonStyle}
        onPress={() => navigation.navigate('ObservationsList')}>
        <NotebookPenIcon
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
        accessibilityLabel="Go to map."
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
        accessibilityLabel="Go to camera."
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
        accessibilityLabel="Go to tracking."
        style={styles.buttonStyle}
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
  const timer = useTrackTimer();
  return (
    <>
      {isTracking && (
        <View style={styles.runtimeWrapper}>
          <View style={styles.indicator} />
          <BodyText
            variant="tinyMeta"
            numberOfLines={1}
            maxFontSizeMultiplier={1.15}
            style={styles.timer}>
            {timer}
          </BodyText>
        </View>
      )}
      <TracksIcon fill={isSelected ? COMAPEO_BLUE : MEDIUM_GREY} height={20} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonStyle: {
    marginTop: 25,
    flex: 1,
    alignItems: 'center',
  },
  runtimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 99,
    backgroundColor: '#59A553',
  },
  timer: {
    marginLeft: 5,
    // the clock redraws the numbers every second without fixed-width digits
    fontVariant: ['tabular-nums'],
  },
});
