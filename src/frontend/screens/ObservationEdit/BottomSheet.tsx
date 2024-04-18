import * as React from 'react';
import {
  Keyboard,
  View,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import {defineMessages, FormattedMessage} from 'react-intl';

const m = defineMessages({
  addLabel: {
    id: 'screens.ObservationEdit.BottomSheet.addLabel',
    defaultMessage: 'Add…',
    description:
      'Label above keyboard that expands into bottom sheet of options to add (photo, details etc)',
  },
});

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress: () => any;
};

type BottomSheepProps = {
  items: Props[];
};

export const BottomSheet = ({items}: BottomSheepProps) => {
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
    <View style={[styles.container]}>
      {keyboardVisible ? (
        <KeyboardAccessory
          icons={items.map(i => i.icon)}
          onPress={() => Keyboard.dismiss()}
        />
      ) : (
        <>
          {items.map(item => (
            <ItemButton key={item.label} {...item} />
          ))}
        </>
      )}
    </View>
  );
};

const ItemButton = ({onPress, icon, label}: Props) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.itemContainer}>
      <View style={styles.itemIcon}>{icon}</View>
      <Text numberOfLines={1} style={styles.itemLabel}>
        {label}
      </Text>
    </View>
  </TouchableNativeFeedback>
);

const KeyboardAccessory = ({
  onPress,
  icons,
}: {
  icons: React.ReactNode[];
  onPress: () => any;
}) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.accessoryContainer}>
      <Text numberOfLines={1} style={styles.accessoryLabel}>
        <FormattedMessage {...m.addLabel} />
      </Text>
      <View style={styles.accessoryIconContainer}>
        {icons.map((icon, idx) => (
          <View key={idx} style={styles.accessoryIcon}>
            {icon}
          </View>
        ))}
      </View>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignSelf: 'flex-end',
    width: '100%',
    flexDirection: 'column',
    alignContent: 'flex-end',
  },
  itemContainer: {
    flex: 0,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  itemIcon: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  itemLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
  },
  accessoryContainer: {
    flex: 0,
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  accessoryIconContainer: {
    flexDirection: 'row',
  },
  accessoryIcon: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  accessoryLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
