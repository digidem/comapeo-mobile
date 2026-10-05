import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {BottomSheetWrapper} from '../../../sharedComponents/BottomSheetWrapper';
import {ProjectCard} from '../../../sharedComponents/ProjectCard';
import {DeviceIcon} from '../../../sharedComponents/DeviceIcon';
import {
  PrimaryButton,
  SecondaryDestructiveButton,
} from '../../../sharedComponents/Buttons';
import {LoadingIndicator} from '../../../sharedComponents/LoadingIndicator';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {
  useAcceptJoinRequest,
  useDenyJoinRequest,
} from '../../../hooks/useInviteLinks';
import {COORDINATOR_ROLE_ID} from '../../../sharedTypes';
import {BLACK, BLUE_GREY, NEW_DARK_GREY} from '../../../lib/styles';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

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
  coordinator: {
    id: 'screens.YourTeam.ReviewJoinRequest.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: 'screens.YourTeam.ReviewJoinRequest.participant',
    defaultMessage: 'Participant',
  },
});

export function ReviewJoinRequest({
  route,
  navigation,
}: NativeRootNavigationProps<'ReviewJoinRequest'>) {
  const {formatMessage: t} = useIntl();
  const request = route.params;
  const acceptJoinRequest = useAcceptJoinRequest();
  const denyJoinRequest = useDenyJoinRequest();
  const [isResponding, setIsResponding] = React.useState(false);

  const {
    inviteId,
    deviceId,
    deviceName,
    deviceType,
    projectName,
    projectColor,
    roleId,
  } = request;
  const isCoordinator = roleId === COORDINATOR_ROLE_ID;

  async function accept() {
    setIsResponding(true);
    await acceptJoinRequest({inviteId, deviceId});
    navigation.replace('JoinRequestAccepted', {deviceName, projectName});
  }

  async function deny() {
    setIsResponding(true);
    await denyJoinRequest({inviteId, deviceId});
    navigation.replace('JoinRequestDenied');
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.deviceCard}>
          <DeviceIcon deviceType={deviceType} size={40} />
          <HeaderText variant="header5" style={styles.flex}>
            {deviceName}
          </HeaderText>
        </View>

        <BodyText variant="tinyMeta" style={styles.requestingLabel}>
          {t(m.requestingToJoin)}
        </BodyText>

        <ProjectCard projectName={projectName} color={projectColor}>
          <View style={styles.roleRow}>
            <MaterialIcon
              name={isCoordinator ? 'manage-accounts' : 'people'}
              size={20}
              color={NEW_DARK_GREY}
            />
            <BodyText style={styles.roleLabel}>
              {isCoordinator ? t(m.coordinator) : t(m.participant)}
            </BodyText>
          </View>
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
    fontWeight: '500',
    color: BLACK,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleLabel: {
    color: NEW_DARK_GREY,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 18,
    gap: 12,
  },
});
