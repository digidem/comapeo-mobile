import React from 'react';
import {Keyboard} from 'react-native';
import {Divider} from '../Divider';
import {KeyboardAccessory} from './KeyboardAccessory';
import {Actions} from './Actions';
import {useKeyboardListener} from '../../hooks/useKeyboardListener';

export interface ActionTabItems {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  testID?: string;
}

export interface ActionProps {
  items: ActionTabItems[];
}

export function ActionTab({items}: ActionProps) {
  const {keyboardVisible} = useKeyboardListener();

  return (
    <>
      <Divider />
      {!keyboardVisible ? (
        <Actions items={items} />
      ) : (
        <KeyboardAccessory items={items} onPress={() => Keyboard.dismiss()} />
      )}
    </>
  );
}
