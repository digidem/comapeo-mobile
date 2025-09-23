import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetWrapper} from '../../../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'screens.ProjectStatisticsTurnedOff.title',
    defaultMessage: 'Project Statistics | OFF',
  },
  desc: {
    id: 'screens.ProjectStatisticsTurnedOff.desc',
    defaultMessage:
      'This change will take effect next time you Exchange with team members.',
  },
  close: {
    id: 'screens.ProjectStatisticsTurnedOff.close',
    defaultMessage: 'Close',
  },
});

export const ProjectStatsTurnedOffBottomSheet = ({
  navigation,
}: NativeRootNavigationProps<'ProjectStatsTurnedOff'>) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetWrapper>
      <View style={styles.container} testID="PROJECT_STATS.off-sheet">
        <View style={{alignItems: 'center', gap: 10}}>
          <HeaderText variant="header2" style={{textAlign: 'center'}}>
            {formatMessage(m.title)}
          </HeaderText>
          <BodyText style={{textAlign: 'center'}}>
            {formatMessage(m.desc)}
          </BodyText>
        </View>

        <SecondaryButton
          fullSize
          text={formatMessage(m.close)}
          onPress={() => navigation.goBack()}
        />
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
});
