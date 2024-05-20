import React from 'react';
import {Keyboard} from 'react-native';
import {Divider} from '../Divider';
import {KeyboardAccessory} from './KeyboardAccessory';
import {Actions} from './Actions';

export interface ActionTabItems {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export interface ActionProps {
  items: ActionTabItems[];
}

export default function ActionTab({items}: ActionProps) {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardHideUnsub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    const keyboardShowUnsub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );

    return () => {
      keyboardHideUnsub.remove();
      keyboardShowUnsub.remove();
    };
  }, []);

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
