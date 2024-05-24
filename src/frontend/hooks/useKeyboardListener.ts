import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Keyboard} from 'react-native';

export function useKeyboardListener() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
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
    }, []),
  );

  return {keyboardVisible};
}
