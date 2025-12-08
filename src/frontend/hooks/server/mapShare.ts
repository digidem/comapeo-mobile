import {type UseMutationResult} from '@tanstack/react-query';

// TODO: replace with @comapeo/core-react when useSendMapShare/useRequestCancelMapShare ship

type MapShareMutationResult = Pick<
  UseMutationResult<unknown, unknown, unknown, unknown>,
  'error' | 'mutate' | 'mutateAsync' | 'reset' | 'status'
>;

const fallbackError = new Error(
  'Map share hooks are not available in the current @comapeo/core-react version.',
);

const fallbackResult: MapShareMutationResult = {
  error: fallbackError,
  mutate: () => {},
  mutateAsync: () => Promise.reject(fallbackError),
  reset: () => {},
  status: 'error',
};

export function useSendMapShare(_opts: {
  projectId: string;
}): MapShareMutationResult {
  void _opts;
  return fallbackResult;
}

export function useRequestCancelMapShare(_opts: {
  projectId: string;
}): MapShareMutationResult {
  void _opts;
  return fallbackResult;
}
