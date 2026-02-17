import {renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {useManyMembers} from '@comapeo/core-react';

import {ActiveProjectProvider} from '../contexts/ActiveProjectContext';
import {useIsLastCoordinator} from './useIsLastCoordinator';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';
import {type MemberInfo} from '@comapeo/core/dist/member-api';

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
  roleId: string,
  deviceType: 'mobile' | 'desktop' = 'mobile',
): MemberInfo {
  return {
    deviceId,
    name: `Device ${deviceId}`,
    role: {roleId},
    deviceType,
    joinedAt: new Date().toISOString(),
  } as MemberInfo;
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('useIsLastCoordinator', () => {
  test('returns true when device is the only coordinator', () => {
    const members = [
      mockMember('device-coordinator', COORDINATOR_ROLE_ID),
      mockMember('device-member-1', MEMBER_ROLE_ID),
      mockMember('device-member-2', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-coordinator'}),
      {wrapper},
    );

    expect(result.current).toBe(true);
  });

  test('returns true when device is the only creator (creator role)', () => {
    const members = [
      mockMember('device-creator', CREATOR_ROLE_ID),
      mockMember('device-member-1', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-creator'}),
      {wrapper},
    );

    expect(result.current).toBe(true);
  });

  test('returns false when there are multiple coordinators', () => {
    const members = [
      mockMember('coordinator-1', COORDINATOR_ROLE_ID),
      mockMember('coordinator-2', COORDINATOR_ROLE_ID),
      mockMember('device-member-1', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = renderHook(
      () => useIsLastCoordinator({deviceId: 'coordinator-1'}),
      {wrapper},
    );

    expect(result.current).toBe(false);
  });

  test('returns false when device is not a coordinator', () => {
    const members = [
      mockMember('coordinator-1', COORDINATOR_ROLE_ID),
      mockMember('device-member-1', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-member-1'}),
      {wrapper},
    );

    expect(result.current).toBe(false);
  });

  test('returns false when there are no coordinators', () => {
    const members = [
      mockMember('device-member-1', MEMBER_ROLE_ID),
      mockMember('device-member-2', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-member-1'}),
      {wrapper},
    );

    expect(result.current).toBe(false);
  });

  test('returns false when members array is empty', () => {
    jest.mocked(useManyMembers).mockReturnValue({
      data: [],
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-1'}),
      {wrapper},
    );

    expect(result.current).toBe(false);
  });

  test('returns false when device ID does not match the coordinator', () => {
    const members = [
      mockMember('device-coordinator', COORDINATOR_ROLE_ID),
      mockMember('device-member-1', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();
    const {result} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-random'}),
      {wrapper},
    );

    expect(result.current).toBe(false);
  });

  test('handles mixed coordinator and creator roles correctly', () => {
    const members = [
      mockMember('device-creator', CREATOR_ROLE_ID),
      mockMember('device-coordinator', COORDINATOR_ROLE_ID),
      mockMember('device-member-1', MEMBER_ROLE_ID),
    ];

    jest.mocked(useManyMembers).mockReturnValue({
      data: members,
      error: null,
      isRefetching: false,
    });

    const wrapper = createWrapper();

    const {result: result1} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-creator'}),
      {wrapper},
    );
    expect(result1.current).toBe(false);

    const {result: result2} = renderHook(
      () => useIsLastCoordinator({deviceId: 'device-coordinator'}),
      {wrapper},
    );
    expect(result2.current).toBe(false);
  });
});
