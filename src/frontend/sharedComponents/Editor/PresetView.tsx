import * as React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {BLACK, COMAPEO_BLUE} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  change: {
    id: 'sharedComponents.Editor.PresetView.Change',
    defaultMessage: 'Change',
  },
});

type PresetViewProps = {
  onPressPreset?: () => void;
  presetName: string;
  PresetIcon: React.ReactNode;
  isTracking?: boolean;
};

export const PresetView = ({
  onPressPreset,
  presetName,
  PresetIcon,
  isTracking = false,
}: PresetViewProps) => {
  const {formatMessage} = useIntl();
  return (
    <TouchableOpacity
      disabled={!onPressPreset}
      onPress={onPressPreset}
      style={styles.preset}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {PresetIcon}
        <Text style={styles.categoryName}>{presetName}</Text>
      </View>
      {!isTracking && (
        <Text style={styles.changeButtonText}>{formatMessage(m.change)}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  changeButtonText: {
    color: COMAPEO_BLUE,
    fontSize: 14,
    fontWeight: '500',
  },
  preset: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: BLACK,
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
