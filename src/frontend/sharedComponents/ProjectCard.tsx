import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {ColorCard} from './ColorCard';
import {HeaderText} from './Text/HeaderText';
import {DEFAULT_PROJECT_COLOR} from '../constants';
import {BLACK} from '../lib/styles';

/**
 * The project name on its own colour, used wherever a screen has to say which
 * project is being talked about. Children sit under the name, for a role or
 * any other detail the screen needs.
 */
export function ProjectCard({
  projectName,
  color,
  borderColor,
  children,
}: {
  projectName: string;
  color?: string;
  /** Set to draw attention to the card, e.g. once a join is under way. */
  borderColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.wrapper}>
      <ColorCard
        backgroundColor={color || DEFAULT_PROJECT_COLOR}
        borderColor={borderColor}
        borderWidth={borderColor ? 2 : undefined}>
        <View style={styles.content}>
          <HeaderText variant="header2" style={styles.name}>
            {projectName}
          </HeaderText>
          {children}
        </View>
      </ColorCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
  content: {
    padding: 20,
    gap: 5,
  },
  name: {
    color: BLACK,
  },
});
