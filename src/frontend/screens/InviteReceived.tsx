import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import InviteIcon from '../images/AddPersonCircle.svg';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY} from '../lib/styles';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {
  useAcceptInvite,
  useRejectInvite,
  useSingleInvite,
} from '@comapeo/core-react';
import {useEffect} from 'react';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';

const m = defineMessages({
  navTitle: {
    id: 'screens.InviteReceived.navTitle',
    defaultMessage: 'Invite Received',
  },
  acceptInvite: {
    id: 'screens.InviteReceived.acceptInvite',
    defaultMessage: 'Accept Invite',
  },
  declineInvite: {
    id: 'screens.InviteReceived.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  joinProject: {
    id: 'screens.InviteReceived.joinProject',
    defaultMessage: 'Join Project {projectName}',
  },
  invitedToJoin: {
    id: 'screens.InviteReceived.invitedToJoin',
    defaultMessage: "You've been invited to join {projectName}",
  },
});

export const InviteReceived: NativeNavigationComponent<'InviteReceived'> = ({
  route,
  navigation,
}) => {
  const {formatMessage} = useIntl();
  const inviteId = route.params.inviteId;
  const {data: invite} = useSingleInvite({inviteId});
  const acceptInvite = useAcceptInvite();
  const rejectInvite = useRejectInvite();

  useEffect(() => {
    if (invite.state === 'canceled') {
      navigation.replace('Home', {screen: 'Map'});
    }
  }, [invite.state, navigation]);

  function accept() {
    acceptInvite.mutate(
      {inviteId: inviteId},
      {
        onSuccess: () => {
          navigation.popTo('Home', {screen: 'Map'});
        },
      },
    );
  }

  function reject() {
    rejectInvite.mutate(
      {inviteId: inviteId},
      {
        onSuccess: () => {
          navigation.popTo('Home', {screen: 'Map'});
        },
      },
    );
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.inviteIcon}>
        <InviteIcon
          style={{borderWidth: 1, borderColor: LIGHT_GREY}}
          fill={LIGHT_GREY}
          width={60}
          height={60}
        />
      </View>
      <HeaderText variant="header2">
        {formatMessage(m.joinProject, {projectName: invite.projectName})}
      </HeaderText>
      <BodyText variant="large">
        {formatMessage(m.invitedToJoin, {projectName: invite.projectName})}
      </BodyText>
      <View style={styles.buttonContainer}>
        <SecondaryButton
          fullSize
          onPress={reject}
          text={formatMessage(m.declineInvite)}
        />
        <PrimaryButton
          fullSize
          onPress={accept}
          text={formatMessage(m.acceptInvite)}
        />
      </View>
    </BottomSheetWrapper>
  );
};

InviteReceived.navTitle = m.navTitle;

const styles = StyleSheet.create({
  inviteIcon: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
