import {defineMessages, type MessageDescriptor} from 'react-intl';
import {
  AlreadyJoinedError,
  InviteConnectionError,
  InviteDeniedByInviterError,
  InviteNotFoundError,
  InviteRedeemConnectionClosedError,
  InviteSendError,
  JoinProjectCancelledError,
  ProjectExistsError,
  UnknownInviteIDError,
} from '@comapeo/core/errors.js';
import {ExhaustivenessError} from '../../lib/ExhaustivenessError';
import type {CircleIcon} from '../../sharedComponents/StatusCircleIcon';
import {LINK_ICON_ROTATION} from '../../sharedComponents/LinkIcon';
import {BLUE_GREY} from '../../lib/styles';

// Codes @comapeo/core attaches to the error on a `failed` join request. Errors
// lose their prototype crossing the IPC boundary, so these are matched on
// `error.code`, never with `instanceof`.
export const JOIN_FAILURE_CODES = [
  InviteConnectionError.code,
  InviteRedeemConnectionClosedError.code,
  InviteDeniedByInviterError.code,
  UnknownInviteIDError.code,
  JoinProjectCancelledError.code,
  AlreadyJoinedError.code,
  ProjectExistsError.code,
  InviteNotFoundError.code,
  InviteSendError.code,
] as const;

export type JoinFailureCode = (typeof JOIN_FAILURE_CODES)[number] | 'UNKNOWN';

export function toJoinFailureCode(code: string | undefined): JoinFailureCode {
  return (JOIN_FAILURE_CODES as readonly string[]).includes(code ?? '')
    ? (code as JoinFailureCode)
    : 'UNKNOWN';
}

const m = defineMessages({
  failedToConnectTitle: {
    id: 'screens.Invites.JoinProject.failedToConnectTitle',
    defaultMessage: 'Failed to connect.',
  },
  connectionLostTitle: {
    id: 'screens.Invites.JoinProject.connectionLostTitle',
    defaultMessage: 'Connection Lost',
  },
  deniedTitle: {
    id: 'screens.Invites.JoinProject.deniedTitle',
    defaultMessage: 'Request Denied',
  },
  deniedDescription: {
    id: 'screens.Invites.JoinProject.deniedDescription',
    defaultMessage: 'Coordinate with team for a new Invite Link',
  },
  expiredTitle: {
    id: 'screens.Invites.JoinProject.expiredTitle',
    defaultMessage: 'Link has expired.',
  },
  expiredDescription: {
    id: 'screens.Invites.JoinProject.expiredDescription',
    defaultMessage: 'Coordinate with team for a new Invite Link',
  },
  canceledTitle: {
    id: 'screens.Invites.JoinProject.canceledTitle',
    defaultMessage: 'Request Canceled',
  },
  alreadyJoinedTitle: {
    id: 'screens.Invites.JoinProject.alreadyJoinedTitle',
    defaultMessage: 'Already a member',
  },
  alreadyJoinedDescription: {
    id: 'screens.Invites.JoinProject.alreadyJoinedDescription',
    defaultMessage: 'This device has already joined this project.',
  },
  unknownTitle: {
    id: 'screens.Invites.JoinProject.unknownTitle',
    defaultMessage: 'Something went wrong',
  },
  unknownDescription: {
    id: 'screens.Invites.JoinProject.unknownDescription',
    defaultMessage: 'Coordinate with team for a new Invite Link',
  },
});

export type JoinFailureCopy = {
  title: MessageDescriptor;
  description?: MessageDescriptor;
  icon: CircleIcon;
};

export function getJoinFailureCopy(code: JoinFailureCode): JoinFailureCopy {
  switch (code) {
    case InviteConnectionError.code:
      return {
        title: m.failedToConnectTitle,
        icon: {name: 'wifi', color: BLUE_GREY},
      };
    case InviteRedeemConnectionClosedError.code:
      return {
        title: m.connectionLostTitle,
        icon: {name: 'wifi', color: BLUE_GREY},
      };
    case InviteDeniedByInviterError.code:
      return {
        title: m.deniedTitle,
        description: m.deniedDescription,
        icon: {name: 'send'},
      };
    case UnknownInviteIDError.code:
      return {
        title: m.expiredTitle,
        description: m.expiredDescription,
        icon: {name: 'link', rotate: LINK_ICON_ROTATION},
      };
    case JoinProjectCancelledError.code:
      return {title: m.canceledTitle, icon: {name: 'send'}};
    // No design for these two yet
    case AlreadyJoinedError.code:
    case ProjectExistsError.code:
      return {
        title: m.alreadyJoinedTitle,
        description: m.alreadyJoinedDescription,
        // No design for this one yet, so the icon is a guess.
        icon: {name: 'group'},
      };
    case InviteNotFoundError.code:
    case InviteSendError.code:
    case 'UNKNOWN':
      return {
        title: m.unknownTitle,
        description: m.unknownDescription,
        // No design for this one yet, so the icon is a guess.
        icon: {name: 'error-outline'},
      };
    default:
      throw new ExhaustivenessError(code);
  }
}
