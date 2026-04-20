import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export function useKeyboardListener() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardHideUnsub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    const keyboardShowUnsub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });

    return () => {
      keyboardHideUnsub.remove();
      keyboardShowUnsub.remove();
    };
  }, []);

  return {keyboardVisible, keyboardHeight};
}
