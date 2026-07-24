import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import * as Sentry from '@sentry/react-native';

import ErrorSvg from '../../images/Error.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useRemoveCustomMapFile} from '@comapeo/core-react';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

const m = defineMessages({
  deleteCustomMapTitle: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.deleteCustomMapTitle',
    defaultMessage: 'Delete Custom Map?',
  },
  deleteCustomMapDescription: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.deleteCustomMapDescription',
    defaultMessage:
      'This will delete the map and its offline areas. No collected observation data will be deleted.',
  },
  cannotBeUndone: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.cannotBeUndone',
    defaultMessage: 'This cannot be undone.',
  },
  deleteMapButtonText: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.deleteMapButtonText',
    defaultMessage: 'Delete Map',
  },
  close: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.close',
    defaultMessage: 'Close',
  },
});

export const DeleteCustomMapBottomSheet = () => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const removeCustomMapMutation = useRemoveCustomMapFile();

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.icon}>
          <ErrorSvg />
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.deleteCustomMapTitle)}
        </HeaderText>

        <BodyText variant="large" style={styles.description}>
          {t(m.deleteCustomMapDescription)}
          {'\n\n'}
          {t(m.cannotBeUndone)}
        </BodyText>

        {removeCustomMapMutation.status === 'pending' ? (
          <View style={styles.loading}>
            <LoadingIndicator size="large" />
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <DestructiveButton
              fullSize
              text={t(m.deleteMapButtonText)}
              renderIcon={({color, size}) => (
                <MaterialIcon size={size} name="delete" color={color} />
              )}
              onPress={() => {
                removeCustomMapMutation.mutate(undefined, {
                  onSuccess: () => {
                    navigation.goBack();
                  },
                  onError: err => {
                    Sentry.captureException(err);
                    navigation.navigate('ErrorBottomSheet', {error: err});
                  },
                });
              }}
            />
            <SecondaryButton
              fullSize
              text={t(m.close)}
              onPress={() => navigation.goBack()}
            />
          </View>
        )}
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    minHeight: 400,
    paddingTop: 20,
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  loading: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
