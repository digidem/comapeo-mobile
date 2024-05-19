import * as React from 'react';
import {BottomSheetContent} from '../BottomSheetModal';
import {View} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import InviteIcon from '../images/AddPersonCircle.svg';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  declineInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.NewInviteBottomSheetContent.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  acceptInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.NewInviteBottomSheetContent.acceptInvite',
    defaultMessage: 'Accept Invite',
  },
  joinProject: {
    id: 'sharedComponents.ProjectInviteBottomSheet.NewInviteBottomSheetContent.joinProject',
    defaultMessage: 'Join Project {projName}',
  },
  invitedToJoin: {
    id: 'sharedComponents.ProjectInviteBottomSheet.NewInviteBottomSheetContent.invitedToJoin',
    defaultMessage: "You've been invited to join {projName}",
  },
});

type NewInviteBottomSheetContentProp = {
  isLoading?: boolean;
  handleReject: () => void;
  handleAccept: () => void;
  projectName?: string;
};

export const NewInviteBottomSheetContent = ({
  isLoading,
  handleReject,
  handleAccept,
  projectName,
}: NewInviteBottomSheetContentProp) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetContent
      loading={isLoading}
      buttonConfigs={[
        {
          variation: 'outlined',
          onPress: handleReject,
          text: formatMessage(m.declineInvite),
        },
        {
          variation: 'filled',
          onPress: handleAccept,
          text: formatMessage(m.acceptInvite),
        },
      ]}
      title={formatMessage(m.joinProject, {
        projName: projectName || '',
      })}
      description={formatMessage(m.invitedToJoin, {
        projName: projectName || '',
      })}
      icon={
        <View
          style={{
            borderColor: LIGHT_GREY,
            borderWidth: 1,
            borderRadius: 100,
            alignItems: 'center',
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}>
          <InviteIcon
            style={{borderWidth: 1, borderColor: LIGHT_GREY}}
            fill={LIGHT_GREY}
            width={60}
            height={60}
          />
        </View>
      }
    />
  );
};
