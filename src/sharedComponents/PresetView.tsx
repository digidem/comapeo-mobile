import {type ReactNode} from 'react';
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
  PresetIcon: ReactNode;
  presetDisabled?: boolean;
  testID?: string;
};

export const PresetView = ({
  onPressPreset,
  presetName,
  PresetIcon,
  presetDisabled = false,
  testID,
}: PresetViewProps) => {
  const {formatMessage} = useIntl();
  return (
    <TouchableOpacity
      disabled={presetDisabled}
      onPress={presetDisabled ? undefined : onPressPreset}
      style={styles.preset}
      testID={testID}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {PresetIcon}
        <BodyText weight={700} variant="large" style={styles.categoryName}>
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
    flexShrink: 1,
  },
});
