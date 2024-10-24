import * as React from 'react';
import {
  DimensionValue,
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {NEW_DARK_GREY, VERY_LIGHT_BLUE} from '../lib/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Text} from './Text';

type FlatListProps = React.ComponentProps<typeof FlatList<MenuListItemType>>;

type MenuListProps = Omit<FlatListProps, 'renderItem'>;

export const MenuList = ({
  data,
  contentContainerStyle,
  ...rest
}: MenuListProps) => {
  // Horizontal padding is applied to the item so that the onPress highlight shows up accross the entire screen
  const {paddingLeft, paddingRight, remainingStyles} = extractPadding(
    contentContainerStyle,
  );

  return (
    <FlatList
      {...rest}
      contentContainerStyle={remainingStyles}
      data={data}
      renderItem={({item}) => (
        <MenuListItem
          item={item}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
        />
      )}
    />
  );
};

export type MenuListItemType = {
  primaryText: string;
  onPress: () => void;
  secondaryText?: string;
  testID?: string;
  disabled?: boolean;
} & (
  | {materialIconName: string; icon?: never} // Has materialIconName but no icon
  | {icon: React.ReactNode; materialIconName?: never} // Has icon but no materialIconName
  | {materialIconName?: never; icon?: never} // Has neither
);

const MenuListItem = ({
  item,
  paddingLeft,
  paddingRight,
}: {
  item: MenuListItemType;
  paddingLeft?: DimensionValue;
  paddingRight?: DimensionValue;
}) => {
  return (
    <TouchableNativeFeedback
      testID={item.testID}
      onPress={item.onPress}
      disabled={item.disabled}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
      <View
        testID={item.testID}
        style={[styles.itemContainer, {paddingLeft, paddingRight}]}>
        {item.materialIconName ? (
          <MaterialIcon
            name={item.materialIconName}
            size={24}
            color={'rgba(0, 0, 0, 0.54)'}
          />
        ) : item.icon ? (
          item.icon
        ) : null}
        <View>
          <Text>{item.primaryText}</Text>
          {item.secondaryText && (
            <Text style={styles.secondaryText}>{item.secondaryText}</Text>
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

function extractPadding(style: StyleProp<ViewStyle>) {
  if (!style) return {paddingLeft: 0, paddingRight: 0, remainingStyles: {}};

  const flattenStyle = StyleSheet.flatten(style); // Flatten style if it's an array or object
  const {
    paddingLeft = 0,
    paddingRight = 0,
    paddingHorizontal = 0,
    padding = 0,
    ...remainingStyles
  } = flattenStyle || {};

  // Use paddingHorizontal as a fallback for paddingLeft/paddingRight if they're not explicitly defined
  return {
    paddingLeft: paddingLeft || paddingHorizontal || padding,
    paddingRight: paddingRight || paddingHorizontal || padding,
    remainingStyles,
  };
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 20,
  },
  secondaryText: {fontSize: 14, color: NEW_DARK_GREY},
});
