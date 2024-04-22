import React, {FC} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {SvgProps} from 'react-native-svg';

export interface ActionButtonType {
  onPress: () => void;
  icon: React.FC<SvgProps>;
  text: string;
}

export const ActionButton: FC<ActionButtonType> = ({
  onPress,
  icon: Icon,
  text,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: 'center',
        marginHorizontal: 59.5,
        marginVertical: 10,
      }}>
      <Icon />
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginTop: 10,
  },
});
