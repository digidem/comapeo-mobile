import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import SuccessCheck from '../../../images/Success.svg';
import {usePreventBackNavigation} from '../../../hooks/usePreventBackNavigation';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const m = defineMessages({
  accepted: {
    id: 'screens.YourTeam.JoinRequestAccepted.accepted',
    defaultMessage: 'Accepted!',
  },
  joinedProject: {
    id: 'screens.YourTeam.JoinRequestAccepted.joinedProject',
    defaultMessage:
      '<bold>{deviceName}</bold> joined project <bold>{projectName}</bold>',
  },
  close: {
    id: 'screens.YourTeam.JoinRequestAccepted.close',
    defaultMessage: 'Close',
  },
});

export function JoinRequestAccepted({
  route,
  navigation,
}: NativeRootNavigationProps<'JoinRequestAccepted'>) {
  const {formatMessage: t} = useIntl();
  usePreventBackNavigation();
  const {deviceName, projectName} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SuccessCheck width={100} height={100} />

        <HeaderText variant="header1">{t(m.accepted)}</HeaderText>

        <BodyText>
          <FormattedMessage
            {...m.joinedProject}
            values={{
              deviceName,
              projectName,
              bold: (chunks: React.ReactNode) => (
                <HeaderText variant="header5">{chunks}</HeaderText>
              ),
            }}
          />
        </BodyText>
      </View>

      <SecondaryButton
        fullSize
        text={t(m.close)}
        onPress={() => navigation.navigate('YourTeam')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
});
