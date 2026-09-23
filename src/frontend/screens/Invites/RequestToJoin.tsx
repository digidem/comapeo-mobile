import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import Ionicons from '@react-native-vector-icons/ionicons';

import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {ColorCard} from '../../sharedComponents/ColorCard';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BLACK, LIGHT_ORANGE} from '../../lib/styles';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  receivedLinkTo: {
    id: 'screens.Invites.RequestToJoin.receivedLinkTo',
    defaultMessage: "You've received a link to...",
  },
  requestToJoin: {
    id: 'screens.Invites.RequestToJoin.requestToJoin',
    defaultMessage: 'Request to Join',
  },
  close: {
    id: 'screens.Invites.RequestToJoin.close',
    defaultMessage: 'Close',
  },
});

export const RequestToJoin = ({
  route,
  navigation,
}: NativeRootNavigationProps<'RequestToJoin'>) => {
  const {formatMessage} = useIntl();
  const {projectName} = route.params;

  function requestToJoin() {
    // Joining needs `manager.inviteLinks.createJoinRequest`, which is not
    // reachable from the app until @comapeo/ipc relays the invite-over-internet
    // events (digidem/comapeo-ipc#96) and @comapeo/core-react wraps them.
    navigation.replace('ErrorBottomSheet', {
      error: new Error('Joining by invite link is not implemented yet'),
    });
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <BodyText variant="tinyMeta" style={styles.receivedLabel}>
          {formatMessage(m.receivedLinkTo)}
        </BodyText>

        <ColorCard backgroundColor={LIGHT_ORANGE}>
          <View style={styles.cardContent}>
            <HeaderText variant="header2" style={styles.projectName}>
              {projectName}
            </HeaderText>
          </View>
        </ColorCard>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            fullSize
            testID="RTJ.request-btn"
            onPress={requestToJoin}
            text={formatMessage(m.requestToJoin)}
            renderIcon={({color, size}) => (
              <Ionicons color={color} size={size} name="send-outline" />
            )}
          />
          <SecondaryButton
            fullSize
            testID="RTJ.close-btn"
            onPress={() => navigation.goBack()}
            text={formatMessage(m.close)}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  receivedLabel: {
    textTransform: 'uppercase',
    fontWeight: '500',
    alignSelf: 'stretch',
    color: BLACK,
  },
  cardContent: {
    padding: 20,
    gap: 20,
  },
  projectName: {
    lineHeight: 28,
    color: BLACK,
  },
  buttonContainer: {
    paddingTop: 18,
    gap: 12,
  },
});
