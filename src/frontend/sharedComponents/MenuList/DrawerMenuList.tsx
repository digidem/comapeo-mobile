import * as React from 'react';
import {FlatList} from 'react-native';
import {MenuListItem, MenuListItemType} from './MenuListItem';

type FlatListProps = React.ComponentProps<typeof FlatList<MenuListItemType>>;

type MenuListProps = Omit<FlatListProps, 'renderItem'>;

export const DrawerMenuList = ({
  data,
  contentContainerStyle,
  ...rest
}: MenuListProps) => {
  return (
    <FlatList
      {...rest}
      contentContainerStyle={[contentContainerStyle, {rowGap: 5}]}
      data={data}
      renderItem={({item}) => (
        <MenuListItem
          item={item}
          paddingLeft={15}
          paddingRight={15}
          columnGap={15}
        />
      )}
    />
  );
};
