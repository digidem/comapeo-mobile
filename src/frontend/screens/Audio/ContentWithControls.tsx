import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {Bar} from 'react-native-progress';
import {Duration} from 'luxon';

import {MEDIUM_GREY, WHITE} from '../../lib/styles';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';
import {Row as ControlsRow} from './Controls';

export function ContentWithControls({
  controls,
  message,
  progress,
  timeElapsed,
}: {
  controls: ReactNode;
  message?: string;
  progress?: number;
  timeElapsed: number;
}) {
  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContainerStyle={styles.dockContainer}
      dockContent={<ControlsRow>{controls}</ControlsRow>}>
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {Duration.fromMillis(timeElapsed).toFormat('mm:ss')}
          </Text>

          {typeof progress === 'number' ? (
            <Bar
              // Setting to 0 seems to have issues on Android: https://github.com/oblador/react-native-progress/issues/56
              progress={progress > 0 ? progress : 0.00000001}
              indeterminate={false}
              width={null}
              color={WHITE}
              borderColor="transparent"
              borderRadius={0}
              borderWidth={0}
              unfilledColor={MEDIUM_GREY}
            />
          ) : (
            <View />
          )}
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </ScreenContentWithDock>
  );
}

const styles = StyleSheet.create({
  contentContainer: {flex: 1},
  dockContainer: {paddingVertical: 24},
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 48,
  },
  message: {
    color: WHITE,
    fontSize: 20,
    textAlign: 'center',
  },
  timerText: {
    fontFamily: 'Rubik',
    fontSize: 96,
    fontWeight: 'bold',
    color: WHITE,
    textAlign: 'center',
  },
});
