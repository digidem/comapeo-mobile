// @ts-expect-error - hooks exist in the package but aren't exported from the main index yet
import * as mapHooks from '@comapeo/core-react/dist/esm/hooks/maps.js';

export const useSendMapShare = mapHooks.useSendMapShare;
export const useRequestCancelInvite = mapHooks.useRequestCancelInvite;
export const useManyMapShares = mapHooks.useManyMapShares;
export const useSingleMapShare = mapHooks.useSingleMapShare;
export const useAcceptMapShare = mapHooks.useAcceptMapShare;
export const useRejectMapShare = mapHooks.useRejectMapShare;

// Re-export useRequestCancelInvite as useRequestCancelMapShare for compatibility with existing code
export const useRequestCancelMapShare = mapHooks.useRequestCancelInvite;
