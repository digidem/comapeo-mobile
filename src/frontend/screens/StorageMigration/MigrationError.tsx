import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import RNRestart from 'react-native-restart';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BLUE_GREY, WHITE} from '../../lib/styles';
import ChevronDown from '../../images/chevrondown.svg';
import ChevronUp from '../../images/chevrondown-expanded.svg';
import ErrorIcon from '../../images/Error.svg';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  somethingWrong: {
    id: 'screens.StorageMigration.MigrationError.somethingWrong',
    defaultMessage: 'Something Went Wrong',
  },
  advanced: {
    id: 'screens.StorageMigration.MigrationError.advanced',
    defaultMessage: 'Advanced',
  },
  unknownError: {
    id: 'screens.StorageMigration.MigrationError.unknownError',
    defaultMessage: 'Unknown error',
  },
  restartApp: {
    id: 'screens.StorageMigration.MigrationError.restartApp',
    defaultMessage: 'Restart App',
  },
});

export const MigrationError = ({errorMessage}: {errorMessage?: string}) => {
  const {formatMessage: t} = useIntl();
  const [advancedExpanded, setAdvancedExpanded] = React.useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenContentWithDock
        contentContainerStyle={styles.contentContainer}
        dockContent={
          <PrimaryButton
            fullSize
            testID="STORAGE-MIGRATION.error-restart-btn"
            text={t(m.restartApp)}
            renderIcon={({size, color}) => (
              <MaterialIcon size={size} name="refresh" color={color} />
            )}
            onPress={() => {
              RNRestart.restart();
            }}
          />
        }>
        <View style={styles.titleSection}>
          <ErrorIcon width={80} height={80} />
          <HeaderText variant="header2" style={styles.title}>
            {t(m.somethingWrong)}
          </HeaderText>
        </View>

        <View style={styles.advancedSection}>
          <TouchableOpacity
            style={styles.advancedButton}
            onPress={() => setAdvancedExpanded(prev => !prev)}>
            <HeaderText variant="header5" style={styles.advancedText}>
              {t(m.advanced)}
            </HeaderText>
            {advancedExpanded ? (
              <ChevronUp width={20} height={20} />
            ) : (
              <ChevronDown width={20} height={20} />
            )}
          </TouchableOpacity>

          {advancedExpanded && (
            <View style={styles.errorDetailsContainer}>
              <BodyText style={styles.errorText} variant="tinyMeta">
                {errorMessage || t(m.unknownError)}
              </BodyText>
            </View>
          )}
        </View>
      </ScreenContentWithDock>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    flexGrow: 1,
    gap: 40,
    paddingTop: 80,
  },
  titleSection: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    textAlign: 'center',
  },
  advancedSection: {
    gap: 10,
    alignSelf: 'stretch',
  },
  advancedButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F6F5F6',
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
  },
  advancedText: {
    color: '#807F82',
  },
  errorDetailsContainer: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
    padding: 15,
  },
  errorText: {
    color: '#29292A',
  },
});
