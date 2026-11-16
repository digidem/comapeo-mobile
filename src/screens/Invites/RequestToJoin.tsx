import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import Ionicons from '@react-native-vector-icons/ionicons';

import {useCreateJoinRequest} from '@comapeo/core-react';
import {ExistingJoinRequestError, getErrorCode} from '@comapeo/core/errors.js';
import {toError} from '../../utils/errors';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {ProjectCard} from '../../sharedComponents/ProjectCard';
import {InviteRoleRow} from '../../sharedComponents/InviteRoleRow';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {COORDINATOR_ROLE_ID} from '../../sharedTypes';
import {BLACK} from '../../lib/styles';
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
  const {projectName, roleId, url} = route.params;
  const createJoinRequest = useCreateJoinRequest();

  function showJoinProgress() {
    navigation.replace('JoinProject', route.params);
  }

  function requestToJoin() {
    createJoinRequest.mutate(
      {url},
      {
        onSuccess: showJoinProgress,
        onError: error => {
          // Reopening a link we are already joining with: the existing request
          // is the one to show, so this is not a failure.
          if (getErrorCode(error) === ExistingJoinRequestError.code) {
            showJoinProgress();
            return;
          }

          navigation.replace('ErrorBottomSheet', {
            error: toError(error, 'Could not request to join'),
          });
        },
      },
    );
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <BodyText variant="tinyMeta" weight={500} style={styles.receivedLabel}>
          {formatMessage(m.receivedLinkTo)}
        </BodyText>

        <ProjectCard projectName={projectName}>
          <InviteRoleRow isCoordinator={roleId === COORDINATOR_ROLE_ID} />
        </ProjectCard>

        <View style={styles.buttonContainer}>
          {createJoinRequest.status === 'pending' ? (
            <LoadingIndicator />
          ) : (
            <>
              <PrimaryButton
                fullSize
                testID="RTJ.request-btn"
                onPress={requestToJoin}
                text={formatMessage(m.requestToJoin)}
                renderIcon={({color, size}) => (
                  <Ionicons color={color} size={size} name="send" />
                )}
              />
              <SecondaryButton
                fullSize
                testID="RTJ.close-btn"
                onPress={() => navigation.goBack()}
                text={formatMessage(m.close)}
              />
            </>
          )}
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
    alignSelf: 'stretch',
    color: BLACK,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 18,
    gap: 12,
  },
});
