import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {BottomSheetWrapper} from '../../../sharedComponents/BottomSheetWrapper';
import {ProjectCard} from '../../../sharedComponents/ProjectCard';
import {InviteRoleRow} from '../../../sharedComponents/InviteRoleRow';
import {DeviceIcon} from '../../../sharedComponents/DeviceIcon';
import {
  PrimaryButton,
  SecondaryDestructiveButton,
} from '../../../sharedComponents/Buttons';
import {LoadingIndicator} from '../../../sharedComponents/LoadingIndicator';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {
  useAcceptInviteLinkRequest,
  useDenyInviteLinkRequest,
  useManyInviteLinks,
} from '@comapeo/core-react';
import {
  getErrorCode,
  InviteNotYetRedeemedError,
  PeerDisconnectedSinceRedeemingInviteError,
} from '@comapeo/core/errors.js';
import {useProjectRoleAndDetails} from '../../../hooks/useProjectRoleAndDetails';
import {useLocalPeers} from '../../../hooks/useLocalPeers';
import {toError} from '../../../utils/errors';
import {COORDINATOR_ROLE_ID} from '../../../sharedTypes';
import {BLACK, BLUE_GREY} from '../../../lib/styles';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

// Both of these mean the requesting device is no longer connected, which has
// its own screen rather than the generic error sheet.
const DISCONNECTED_CODES: string[] = [
  InviteNotYetRedeemedError.code,
  PeerDisconnectedSinceRedeemingInviteError.code,
];

const m = defineMessages({
  requestingToJoin: {
    id: 'screens.YourTeam.ReviewJoinRequest.requestingToJoin',
    defaultMessage: 'Requesting to join...',
  },
  accept: {
    id: 'screens.YourTeam.ReviewJoinRequest.accept',
    defaultMessage: 'Accept',
  },
  deny: {
    id: 'screens.YourTeam.ReviewJoinRequest.deny',
    defaultMessage: 'Deny',
  },
  unnamedDevice: {
    id: 'screens.YourTeam.ReviewJoinRequest.unnamedDevice',
    defaultMessage: 'New device',
  },
});

export function ReviewJoinRequest({
  route,
  navigation,
}: NativeRootNavigationProps<'ReviewJoinRequest'>) {
  const {formatMessage: t} = useIntl();
  const {projectId, deviceId, inviteId} = route.params;
  const {projectHeader: projectName, projectColor} =
    useProjectRoleAndDetails(projectId);
  const {data: inviteLinks} = useManyInviteLinks({projectId});
  const peer = useLocalPeers().find(({deviceId: id}) => id === deviceId);

  const roleId = inviteLinks.find(link => link.inviteId === inviteId)?.roleId;
  // The name arrives with device info once the peer is trusted, so it can be
  // missing for the moment between the request landing and that exchange.
  const deviceName = peer?.name || t(m.unnamedDevice);
  const acceptJoinRequest = useAcceptInviteLinkRequest();
  const denyJoinRequest = useDenyInviteLinkRequest();

  const isCoordinator = roleId === COORDINATOR_ROLE_ID;
  const isResponding =
    acceptJoinRequest.status === 'pending' ||
    denyJoinRequest.status === 'pending';

  function showError(error: unknown, message: string) {
    if (DISCONNECTED_CODES.includes(getErrorCode(error) ?? '')) {
      navigation.replace('JoinRequestConnectionLost');
      return;
    }

    navigation.replace('ErrorBottomSheet', {error: toError(error, message)});
  }

  function accept() {
    acceptJoinRequest.mutate(
      {projectId, inviteId, deviceId},
      {
        onSuccess: () =>
          navigation.replace('JoinRequestAccepted', {deviceName, projectName}),
        onError: error => showError(error, 'Could not accept the join request'),
      },
    );
  }

  function deny() {
    denyJoinRequest.mutate(
      {projectId, inviteId, deviceId},
      {
        onSuccess: () => navigation.replace('JoinRequestDenied'),
        onError: error => showError(error, 'Could not deny the join request'),
      },
    );
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.deviceCard}>
          <DeviceIcon deviceType={peer?.deviceType} size={40} />
          <HeaderText variant="header5" style={styles.flex}>
            {deviceName}
          </HeaderText>
        </View>

        <BodyText
          variant="tinyMeta"
          style={styles.requestingLabel}
          weight={500}>
          {t(m.requestingToJoin)}
        </BodyText>

        <ProjectCard projectName={projectName} color={projectColor}>
          {roleId ? <InviteRoleRow isCoordinator={isCoordinator} /> : null}
        </ProjectCard>

        <View style={styles.buttonContainer}>
          {isResponding ? (
            <LoadingIndicator />
          ) : (
            <>
              <PrimaryButton
                fullSize
                text={t(m.accept)}
                onPress={accept}
                renderIcon={({color, size}) => (
                  <MaterialIcon name="send" size={size} color={color} />
                )}
              />
              <SecondaryDestructiveButton
                fullSize
                text={t(m.deny)}
                onPress={deny}
              />
            </>
          )}
        </View>
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  flex: {
    flex: 1,
  },
  requestingLabel: {
    textTransform: 'uppercase',
    color: BLACK,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 18,
    gap: 12,
  },
});
