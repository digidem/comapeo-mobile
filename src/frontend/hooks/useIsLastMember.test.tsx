import {renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import type {MemberApi} from '@comapeo/core';
import {useManyMembers} from '@comapeo/core-react';

import {ActiveProjectProvider} from '../contexts/ActiveProjectContext';
import {useIsLastMember} from './useIsLastMember';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
  BLOCKED_ROLE_ID,
  LEFT_ROLE_ID,
} from '../sharedTypes';

jest.mock('@comapeo/core-react', () => ({
  useManyMembers: jest.fn(),
  useSingleProject: jest.fn(() => ({
    data: {
      $sync: {
        getState: jest.fn(),
      },
    },
  })),
}));

const mockProjectId = 'test-project';

function createWrapper() {
  return ({children}: {children: ReactNode}) => {
    return (
      <ActiveProjectProvider activeProjectId={mockProjectId}>
        {children}
      </ActiveProjectProvider>
    );
  };
}

function mockMember(
  deviceId: string,
  roleId: MemberApi.RoleId,
  deviceType: 'mobile' | 'desktop' = 'mobile',
): MemberApi.MemberInfo {
  return {
    deviceId,
    name: `Device ${deviceId}`,
    // @ts-expect-error Unsound but enough for testing purposes
    role: {roleId},
    deviceType,
    joinedAt: new Date().toISOString(),
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('useIsLastMember', () => {
  test('returns true when device is the only member (coordinator)', async () => {
    const members = [mockMember('device-coordinator', COORDINATOR_ROLE_ID)];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = await renderHook(
      () => useIsLastMember({deviceId: 'device-coordinator'}),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(true);
  });

  test('returns true when device is the only member (participant)', async () => {
    const members = [mockMember('device-member', MEMBER_ROLE_ID)];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = await renderHook(
      () => useIsLastMember({deviceId: 'device-member'}),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(true);
  });

  test('returns false when there are multiple members', async () => {
    const members = [
      mockMember('device-coordinator', COORDINATOR_ROLE_ID),
      mockMember('device-member', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = await renderHook(
      () => useIsLastMember({deviceId: 'device-coordinator'}),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(false);
  });

  test('returns false when members array is empty', async () => {
    jest.mocked(useManyMembers).mockReturnValue({
      data: [],
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = await renderHook(
      () => useIsLastMember({deviceId: 'device-1'}),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(false);
  });

  test('returns false when device ID does not match the member', async () => {
    const members = [mockMember('device-1', COORDINATOR_ROLE_ID)];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = await renderHook(
      () => useIsLastMember({deviceId: 'device-random'}),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(false);
  });

  test('ignores blocked members when counting', async () => {
    const members = [
      mockMember('device-coordinator', COORDINATOR_ROLE_ID),
      mockMember('device-blocked-1', BLOCKED_ROLE_ID),
      mockMember('device-blocked-2', BLOCKED_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = await renderHook(
      () => useIsLastMember({deviceId: 'device-coordinator'}),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(true);
  });

  test('ignores left members when counting', async () => {
    const members = [
      mockMember('device-member', MEMBER_ROLE_ID),
      mockMember('device-left-1', LEFT_ROLE_ID),
      mockMember('device-left-2', LEFT_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = await renderHook(
      () => useIsLastMember({deviceId: 'device-member'}),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(true);
  });

  test('counts both coordinators and participants as members', async () => {
    const members = [
      mockMember('device-creator', CREATOR_ROLE_ID),
      mockMember('device-coordinator', COORDINATOR_ROLE_ID),
      mockMember('device-member', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();

    const {result: result1} = await renderHook(
      () => useIsLastMember({deviceId: 'device-creator'}),
      {wrapper},
    );
    expect(result1.current).toBe(false);

    const {result: result2} = await renderHook(
      () => useIsLastMember({deviceId: 'device-coordinator'}),
      {wrapper},
    );
    expect(result2.current).toBe(false);

    const {result: result3} = await renderHook(
      () => useIsLastMember({deviceId: 'device-member'}),
      {wrapper},
    );
    expect(result3.current).toBe(false);
  });
});
