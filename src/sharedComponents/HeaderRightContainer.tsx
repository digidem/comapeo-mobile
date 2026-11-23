import {type ReactNode} from 'react';
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
  children: ReactNode;
  onPress: ((event: GestureResponderEvent) => void) | (() => void);
  testID?: string;
  loading: boolean;
};

export const HeaderRightContainerButton = ({
  children,
  onPress,
  testID,
  loading,
}: HeaderRightContainerButtonProps) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingIndicator size="large" testID={testID} />
      ) : (
        <TouchableOpacity
          style={styles.container}
          onPress={onPress}
          testID={testID}>
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
  children?: ReactNode;
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
