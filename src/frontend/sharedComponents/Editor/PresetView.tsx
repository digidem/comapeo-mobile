import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {COMAPEO_BLUE} from '../../lib/styles';
import {Text} from '../Text';

const m = defineMessages({
  change: {
    id: 'sharedComponents.Editor.PresetView.Change',
    defaultMessage: 'Change',
  },
});

export type PresetViewProps = {
  onPress: () => void;
  presetName: string;
  PresetIcon: React.ReactNode;
};

export const PresetView = ({
  onPress,
  presetName,
  PresetIcon,
}: PresetViewProps) => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.preset}>
        {PresetIcon}
        <Text style={styles.categoryName}>{presetName}</Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.changeButtonText}>{t(m.change)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    gap: 12,
  },
  preset: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  changeButtonText: {
    color: COMAPEO_BLUE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
