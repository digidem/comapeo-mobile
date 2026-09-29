import * as v from 'valibot';
import {parseInviteURL} from '@comapeo/core/invite-urls.js';

const HEX_KEY_LENGTH = 64;

// Invite links arrive through messaging apps, so the hash is untrusted input.
// This schema is also the source of the `InviteLinkParams` navigation param type.
const InviteLinkSchema = v.object({
  inviteIdString: v.pipe(v.string(), v.length(HEX_KEY_LENGTH)),
  swarmPublicKey: v.pipe(v.string(), v.length(HEX_KEY_LENGTH)),
  invitorName: v.pipe(v.string(), v.nonEmpty()),
  projectName: v.pipe(v.string(), v.nonEmpty()),
  // core runs `parseInt(e) * 1000` and only rejects a falsy result, so a
  // negative or absurd expiry parses fine. Bound it so callers can treat
  // expiresAt as a real timestamp.
  expiresAt: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export type InviteLinkParams = v.InferOutput<typeof InviteLinkSchema>;

export function parseInviteLink(url: string): InviteLinkParams | null {
  let params: unknown;
  try {
    params = parseInviteURL(url);
  } catch {
    return null;
  }

  const result = v.safeParse(InviteLinkSchema, params);
  return result.success ? result.output : null;
}

// Only a fast path, never a security control: the expiry lives in the URL hash,
// so anyone holding the link can edit it. core rejects the invite id itself and
// returns UnknownInviteIDError, which is what actually enforces expiry.
export function isInviteLinkExpired(
  {expiresAt}: InviteLinkParams,
  now = Date.now(),
): boolean {
  return expiresAt <= now;
}
