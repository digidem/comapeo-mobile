import React from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Divider} from '../Divider';
import {ItemButton} from './ItemButton';
import {KeyboardAccessory} from './KeyboardAccessory';

export interface ActionTabItems {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

interface ActionTab {
  items: ActionTabItems[];
}

export default function ActionTab({items}: ActionTab) {
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
        <View style={[styles.container, styles.containerPadding]}>
          {items.map(item => (
            <ItemButton key={item.label} {...item} />
          ))}
        </View>
      ) : (
        <KeyboardAccessory items={items} onPress={() => Keyboard.dismiss()} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  containerPadding: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
});
