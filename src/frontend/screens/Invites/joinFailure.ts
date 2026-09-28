import {defineMessages, type MessageDescriptor} from 'react-intl';
import {ExhaustivenessError} from '../../lib/ExhaustivenessError';

// Codes @comapeo/core attaches to the error on a `failed` join request. Errors
// lose their prototype crossing the IPC boundary, so these are matched on
// `error.code`, never with `instanceof`.
export const JOIN_FAILURE_CODES = [
  'INVITE_CONNECTION_ERROR',
  'INVITE_REDEEM_CONNECTION_CLOSED_ERROR',
  'INVITE_DENIED_BY_INVITER_ERROR',
  'UNKNOWN_INVITE_ID_ERROR',
  'JOIN_PROJECT_CANCELLED_ERROR',
  'ALREADY_JOINED_ERROR',
  'PROJECT_EXISTS_ERROR',
  'INVITE_NOT_FOUND_ERROR',
  'INVITE_SEND_ERROR',
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
};

export function getJoinFailureCopy(code: JoinFailureCode): JoinFailureCopy {
  switch (code) {
    case 'INVITE_CONNECTION_ERROR':
      return {title: m.failedToConnectTitle};
    case 'INVITE_REDEEM_CONNECTION_CLOSED_ERROR':
      return {title: m.connectionLostTitle};
    case 'INVITE_DENIED_BY_INVITER_ERROR':
      return {title: m.deniedTitle, description: m.deniedDescription};
    case 'UNKNOWN_INVITE_ID_ERROR':
      return {title: m.expiredTitle, description: m.expiredDescription};
    case 'JOIN_PROJECT_CANCELLED_ERROR':
      return {title: m.canceledTitle};
    // No design for these two yet
    case 'ALREADY_JOINED_ERROR':
    case 'PROJECT_EXISTS_ERROR':
      return {
        title: m.alreadyJoinedTitle,
        description: m.alreadyJoinedDescription,
      };
    case 'INVITE_NOT_FOUND_ERROR':
    case 'INVITE_SEND_ERROR':
    case 'UNKNOWN':
      return {title: m.unknownTitle, description: m.unknownDescription};
    default:
      throw new ExhaustivenessError(code);
  }
}
