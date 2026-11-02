import type {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

import {DARK_GREY} from '../../../lib/styles';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';

const ICON_SIZE = 24;

export const TrackStatusLabel = ({
  renderIcon,
  text,
}: {
  renderIcon: (props: {color: string; size: number}) => ReactNode;
  text: string;
}) => {
  return (
    <View style={styles.container}>
      {renderIcon({color: DARK_GREY, size: ICON_SIZE})}
      <HeaderText style={styles.text} variant="header6">
        {text}
      </HeaderText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  text: {
    flexShrink: 1,
  },
});
