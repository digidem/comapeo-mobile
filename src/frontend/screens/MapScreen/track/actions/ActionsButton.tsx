import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActionButton, ActionButtonType} from './ActionButton';

interface ActionsButton {
  actions: ActionButtonType[];
}

export const ActionsButton: FC<ActionsButton> = ({actions}) => {
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
