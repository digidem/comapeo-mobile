import * as React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {BLACK, COMAPEO_BLUE} from '../lib/styles';
import {BodyText} from './Text/BodyText';
import {HeaderText} from './Text/HeaderText';
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
  presetDisabled?: boolean;
};

export const PresetView = ({
  onPressPreset,
  presetName,
  PresetIcon,
  presetDisabled = false,
}: PresetViewProps) => {
  const {formatMessage} = useIntl();
  return (
    <TouchableOpacity
      disabled={presetDisabled}
      onPress={presetDisabled ? undefined : onPressPreset}
      style={styles.preset}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {PresetIcon}
        <BodyText variant="large" style={styles.categoryName}>
          {presetName}
        </BodyText>
      </View>
      {!presetDisabled && (
        <HeaderText variant="header6" style={styles.changeButtonText}>
          {formatMessage(m.change)}
        </HeaderText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  changeButtonText: {
    color: COMAPEO_BLUE,
  },
  preset: {
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: BLACK,
    marginLeft: 10,
    fontWeight: 'bold',
    flexShrink: 1,
  },
});
