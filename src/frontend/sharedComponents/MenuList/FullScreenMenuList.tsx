import * as React from 'react';
import {FlatList} from 'react-native';
import {MenuListItem, MenuListItemType} from './MenuListItem';

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
