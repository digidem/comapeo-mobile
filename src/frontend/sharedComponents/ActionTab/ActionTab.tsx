import React from 'react';
import {Pressable} from 'react-native';
import {Keyboard, StyleSheet, Text, View} from 'react-native';
import {Divider} from '../Divider';

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress: () => any;
};

interface ActionTab {
  items: Props[];
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
      {!keyboardVisible && (
        <>
          <Divider />
          <View style={[styles.container]}>
            {items.map(item => (
              <ItemButton key={item.label} {...item} />
            ))}
          </View>
        </>
      )}
    </>
  );
}

const ItemButton = ({onPress, icon, label}: Props) => (
  <Pressable onPress={onPress}>
    <View style={styles.itemContainer}>
      <View style={styles.itemIcon}>{icon}</View>
      <Text numberOfLines={1} style={styles.itemLabel}>
        {label}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemIcon: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontFamily: 'Rubik',
    fontSize: 12,
  },
});
