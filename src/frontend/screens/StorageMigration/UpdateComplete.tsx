import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {WHITE} from '../../lib/styles';
import SuccessIcon from '../../images/Success.svg';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';

const m = defineMessages({
  updateComplete: {
    id: 'screens.StorageMigration.UpdateComplete.updateComplete',
    defaultMessage: 'Update Complete!',
  },
  latestVersionReady: {
    id: 'screens.StorageMigration.UpdateComplete.latestVersionReady',
    defaultMessage: 'The latest version of CoMapeo is ready to use',
  },
  continue: {
    id: 'screens.StorageMigration.UpdateComplete.continue',
    defaultMessage: 'Continue',
  },
});

export const UpdateComplete = ({onContinue}: {onContinue: () => void}) => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.screen}>
      <ScreenContentWithDock
        contentContainerStyle={styles.contentContainer}
        dockContent={
          <PrimaryButton
            fullSize
            testID="STORAGE-MIGRATION.update-complete-continue-btn"
            text={t(m.continue)}
            onPress={onContinue}
          />
        }>
        <IconTitleDescription
          icon={<SuccessIcon width={90} height={90} />}
          title={t(m.updateComplete)}
          description={t(m.latestVersionReady)}
        />
      </ScreenContentWithDock>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
});
