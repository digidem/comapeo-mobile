import * as React from 'react';
import {act, renderHook, RenderHookResult} from '@testing-library/react-native';
import {
  DraftObservationProvider,
  useDraftObservationActions,
  useDraftObservationState,
} from '../src/frontend/contexts/DraftObservationContext';
import {
  createDraftObservationStore,
  DraftState,
  DraftStateEmpty,
} from '../src/frontend/contexts/PersistedStores/DraftObservationStore';
import exp from 'constants';

const mockDraftObservationStore = createDraftObservationStore({persist: false});
function Wrapper({children}: {children: React.ReactNode}) {
  return (
    <DraftObservationProvider draftObservationStore={mockDraftObservationStore}>
      {children}
    </DraftObservationProvider>
  );
}

const EMPTY_DRAFT_OBSERVATION: DraftStateEmpty = {
  value: null,
  id: null,
  unsavedAttachments: null,
  initialPosition: null,
};

describe('DraftObservation actions', () => {
  let state: RenderHookResult<DraftState, unknown>['result'];
  let actions: ReturnType<typeof useDraftObservationActions>;

  beforeEach(() => {
    const stateHook = renderHook(() => useDraftObservationState(), {
      wrapper: Wrapper,
    });

    const actionsHook = renderHook(() => useDraftObservationActions(), {
      wrapper: Wrapper,
    });

    state = stateHook.result;
    actions = actionsHook.result.current;
  });

  it('creates a draft and clears a draft', () => {
    expect(state.current).toEqual(EMPTY_DRAFT_OBSERVATION);

    act(() => {
      actions.createDraft();
    });

    expect(state.current.value).not.toEqual(EMPTY_DRAFT_OBSERVATION);

    act(() => {
      actions.clearDraft();
    });

    expect(state.current).toEqual(EMPTY_DRAFT_OBSERVATION);
  });

  it('throws error when action is attempted on a draft that has not been instantiated', () => {
    expect(() => actions.addAudio('test audio')).toThrow();
    expect(() => actions.deleteUnsavedAttachment(1)).toThrow();
    expect(() =>
      actions.updatePosition({
        manualLocation: true,
        position: {coords: {latitude: 1, longitude: 1}},
      }),
    ).toThrow();
    expect(() => actions.updateTag('name', 'test')).toThrow();
  });
});

function createFakeImage(): Promise<{
  width: number;
  height: number;
  uri: string;
}> {
  return Promise.resolve({
    width: 1920,
    height: 1080,
    uri: 'https://example.com/image.jpg',
  });
}
