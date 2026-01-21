import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../sharedTypes';
import {BodyText} from './Text/BodyText';
import {HeaderText} from './Text/HeaderText';

type HeaderVariant =
  | 'header1'
  | 'header2'
  | 'header3'
  | 'header4'
  | 'header5'
  | 'header6';

/**
 * IconTitleDescription is a styled component for displaying an icon
 * with a centered title and optional description below it.
 *
 * @example
 * <IconTitleDescription
 *   icon={<SuccessCheck />}
 *   title={formatMessage(m.success)}
 *   description={formatMessage(m.successMessage)}
 * />
 */
export const IconTitleDescription = ({
  icon,
  title,
  description,
  headerVariant = 'header2',
  gap = 20,
  style,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  headerVariant?: HeaderVariant;
  gap?: number;
  style?: ViewStyleProp;
}) => {
  return (
    <View style={[styles.container, {gap}, style]}>
      {icon}
      <HeaderText style={styles.title} variant={headerVariant}>
        {title}
      </HeaderText>
      {description && (
        <BodyText style={styles.description}>{description}</BodyText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
