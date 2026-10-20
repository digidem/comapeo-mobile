import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {LoadingIndicator} from './LoadingIndicator';
import {
  HEADER_LIQUID_GLASS_HEIGHT,
  HEADER_LIQUID_GLASS_WIDTH,
} from '../constants';

type HeaderRightContainerButtonProps = {
  children: React.ReactNode;
  onPress: ((event: GestureResponderEvent) => void) | (() => void);
  testID?: string;
  loading: boolean;
};

export const HeaderRightIconContainerButton = ({
  children,
  onPress,
  testID,
  loading,
}: HeaderRightContainerButtonProps) => {
  return (
    <View style={styles.container} testID={testID}>
      {loading ? (
        <LoadingIndicator size="large" />
      ) : (
        <TouchableOpacity style={styles.container} onPress={onPress}>
          {children}
        </TouchableOpacity>
      )}
    </View>
  );
};

export const HeaderRightContainer = ({
  children,
  testID,
}: {
  children?: React.ReactNode;
  testID?: string;
}) => {
  return (
    <View style={styles.container} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: HEADER_LIQUID_GLASS_WIDTH,
    height: HEADER_LIQUID_GLASS_HEIGHT,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
