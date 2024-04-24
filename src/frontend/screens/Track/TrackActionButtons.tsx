import React, {FC} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {Text} from '../../sharedComponents/Text.tsx';

export interface ActionButtonType {
  onPress: () => void;
  icon: React.FC<SvgProps>;
  text: string;
}

interface TrackActionButtons {
  actions: ActionButtonType[];
}

const ActionButton: FC<ActionButtonType> = ({onPress, icon: Icon, text}) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Icon />
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export const ActionButtons: FC<TrackActionButtons> = ({actions}) => {
  return (
    <View style={styles.actionButtons}>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          onPress={action.onPress}
          text={action.text}
          icon={action.icon}
        />
      ))}
    </View>
  );
};

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginHorizontal: 59.5,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#171717',
    elevation: 20,
  },
});
