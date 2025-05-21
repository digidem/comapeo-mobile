import type {ReactNode} from 'react';
import {View} from 'react-native';

import {BLUE_GREY, WHITE} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';

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

export function InfoText({
  type,
  text,
}: {
  type: 'primary' | 'secondary';
  text: string;
}) {
  return (
    <BodyText
      selectable
      style={{color: type === 'primary' ? WHITE : BLUE_GREY, flexWrap: 'wrap'}}>
      {text}
    </BodyText>
  );
}
