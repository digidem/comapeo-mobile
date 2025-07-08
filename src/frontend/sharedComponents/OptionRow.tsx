import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableNativeFeedback} from '../sharedComponents/Touchables';
import {VERY_LIGHT_BLUE} from '../lib/styles';

export const OptionRow = ({
  children,
  onPress,
}: React.PropsWithChildren<{
  onPress: () => void;
}>) => (
  <View style={styles.optionContainer}>
    <View style={styles.pressableContainer}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
        {children}
      </TouchableNativeFeedback>
    </View>
  </View>
);

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pressableContainer: {
    flex: 1,
  },
});
