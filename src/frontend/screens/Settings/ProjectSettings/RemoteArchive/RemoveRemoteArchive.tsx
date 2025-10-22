import {useRemoveServerPeer} from '@comapeo/core-react';
import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import {useActiveProject} from '../../../../contexts/ActiveProjectContext';
import Error from '../../../../images/Error.svg';
import {BottomSheetWrapper} from '../../../../sharedComponents/BottomSheetWrapper';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../../../sharedComponents/Buttons';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../../../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'Settings.ProjectSettings.RemoteArchive.RemoveRemoteArchive.title',
    defaultMessage: 'Remove {name} from project?',
    description:
      'Text for title that asks about confirming archive server removal.',
  },
  description: {
    id: 'Settings.ProjectSettings.RemoteArchive.RemoveRemoteArchive.description',
    defaultMessage:
      'This will stop archiving new data for this project. Existing archived data will not be deleted.',
    description: 'Explanation for consequences of removing archive server.',
  },
  removeArchive: {
    id: 'Settings.ProjectSettings.RemoteArchive.RemoveRemoteArchive.removeArchive',
    defaultMessage: 'Remove Archive',
    description: 'Text for destructive action button.',
  },
  cancel: {
    id: 'Settings.ProjectSettings.RemoteArchive.RemoveRemoteArchive.cancel',
    defaultMessage: 'Cancel',
    description: 'Text for cancel action button.',
  },
});

export function RemoveRemoteArchive({
  navigation,
  route,
}: NativeRootNavigationProps<'RemoveRemoteArchive'>) {
  const {baseUrl, name, serverDeviceId} = route.params;

  const {formatMessage: t} = useIntl();
  const {projectId} = useActiveProject();

  const removeServerPeer = useRemoveServerPeer({projectId});

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Error />
          <HeaderText variant="header2" style={{textAlign: 'center'}}>
            {t(m.title, {name: name || baseUrl})}
          </HeaderText>
          <BodyText style={{textAlign: 'center'}}>{t(m.description)}</BodyText>
        </View>

        <View style={styles.buttonContainer}>
          {removeServerPeer.status === 'pending' ? (
            <UIActivityIndicator style={{flex: 0}} />
          ) : (
            <>
              <DestructiveButton
                fullSize
                text={t(m.removeArchive)}
                renderIcon={({color, size}) => (
                  <MaterialIcons name="delete" size={size} color={color} />
                )}
                onPress={() => {
                  removeServerPeer.mutate(
                    {serverDeviceId},
                    {
                      onError: err => {
                        Sentry.captureException(err);
                        navigation.navigate('ErrorBottomSheet');
                      },
                      onSuccess: () => {
                        navigation.goBack();
                      },
                    },
                  );
                }}
              />
              <SecondaryButton
                fullSize
                text={t(m.cancel)}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </>
          )}
        </View>
      </View>
    </BottomSheetWrapper>
  );
}

export const navigationOptions: NativeStackNavigationOptions = {
  animation: 'none',
  contentStyle: {
    backgroundColor: 'transparent',
  },
  headerShown: false,
  presentation: 'transparentModal',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 40,
  },
  infoContainer: {
    alignItems: 'center',
    gap: 20,
  },
  buttonContainer: {
    gap: 20,
  },
});
