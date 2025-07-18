import type {ReactNode} from 'react';
import {View} from 'react-native';

export function InfoItem({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <View style={{flex: 1, flexDirection: 'row', gap: 12}}>
      <View>{icon}</View>
      <View style={{flex: 1}}>{children}</View>
    </View>
  );
}
