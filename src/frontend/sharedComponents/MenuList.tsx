import * as React from 'react';
import {
  DimensionValue,
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {NEW_DARK_GREY, VERY_LIGHT_BLUE} from '../lib/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Text} from './Text';

type FlatListProps = React.ComponentProps<typeof FlatList<MenuListItemType>>;

type MenuListProps = Omit<FlatListProps, 'renderItem'>;

/**
 *
 * This list is designed for menus and intended to take up its entire container (aka, entire screen or drawer)
 */
export const FullScreenMenuList = ({
  data,
  contentContainerStyle,
  ...rest
}: MenuListProps) => {
  return (
    <FlatList
      {...rest}
      contentContainerStyle={[
        contentContainerStyle,
        {paddingTop: 40, rowGap: 20},
      ]}
      data={data}
      renderItem={({item}) => (
        <MenuListItem
          item={item}
          paddingLeft={20}
          paddingRight={20}
          columnGap={20}
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
  columnGap,
}: {
  item: MenuListItemType;
  paddingLeft: DimensionValue;
  paddingRight: DimensionValue;
  columnGap: number;
}) => {
  return (
    <TouchableNativeFeedback
      testID={item.testID}
      onPress={item.onPress}
      disabled={item.disabled}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
      <View
        testID={item.testID}
        style={[styles.itemContainer, {paddingLeft, paddingRight, columnGap}]}>
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

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  secondaryText: {fontSize: 14, color: NEW_DARK_GREY},
});
