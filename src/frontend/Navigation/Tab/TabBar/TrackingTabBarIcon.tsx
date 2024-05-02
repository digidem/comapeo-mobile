import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {TabBarIcon} from './TabBarIcon.tsx';
import {useTracking} from '../../../hooks/tracks/useTracking.ts';
import {Text} from '../../../sharedComponents/Text.tsx';
import {TabBarIconProps} from '../../types.ts';
import {useTrackTimerContext} from '../../../contexts/TrackTimerContext.tsx';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore.ts';

export const TrackingTabBarIcon: FC<TabBarIconProps> = props => {
  const {isTracking} = useTracking();
  const {timer} = useTrackTimerContext();
  const {currentTab} = useTabNavigationStore();

  return (
    <>
      {isTracking && (
        <View style={styles.runtimeWrapper}>
          <View style={styles.indicator} />
          <Text style={styles.timer}>{timer}</Text>
        </View>
      )}
      <TabBarIcon
        {...props}
        focused={currentTab === 'Tracking'}
        iconName="nordic-walking"
      />
    </>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 12,
  },
});
