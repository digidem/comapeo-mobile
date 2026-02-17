import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../sharedTypes';
import {BodyText} from './Text/BodyText';
import {HeaderText} from './Text/HeaderText';

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
  style,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  style?: ViewStyleProp;
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon}
      <HeaderText style={styles.title} variant="header2">
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
    gap: 20,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
