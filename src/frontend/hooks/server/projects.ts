import {type MemberInfo} from '@comapeo/core/dist/member-api';
import {
  useProjectSettings as useComapeoProjectSettings,
  useManyMembers,
  useOwnRoleInProject,
} from '@comapeo/core-react';
import {useQuery} from '@tanstack/react-query';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {MEMBER_ROLE_ID} from '../../sharedTypes';

export function useProjectSettings() {
  const {projectId} = useActiveProject();
  return useComapeoProjectSettings({projectId});
}

export function useGetOwnRole() {
  const {projectId} = useActiveProject();
  return useOwnRoleInProject({projectId});
}

// TODO: Ideally this is handled in @comapeo/core (https://github.com/digidem/comapeo-core/issues/1031)
export type ArchiveServerMemberInfo = MemberInfo & {
  deviceType: 'selfHostedServer';
  selfHostedServerDetails: NonNullable<MemberInfo['selfHostedServerDetails']>;
};

// TODO: Ideally this is handled in @comapeo/core (https://github.com/digidem/comapeo-core/issues/1031)
function isActiveArchiveServerMember(
  member: MemberInfo,
): member is ArchiveServerMemberInfo {
  if (member.deviceType !== 'selfHostedServer') return false;
  if (!member.selfHostedServerDetails) return false;
  if (member.role.roleId !== MEMBER_ROLE_ID) return false;
  return true;
}

export function useActiveArchiveServer({
  projectId,
}: {
  projectId: string;
}): ArchiveServerMemberInfo | undefined {
  const {data: members} = useManyMembers({projectId});
  return members.find(isActiveArchiveServerMember);
}

export function useFindRemoteArchive({url}: {url?: string}) {
  return useQuery({
    queryFn: async () => {
      if (!url) throw new Error('no url');
      const response = await fetch(url);

      if (response.status !== 200) {
        throw new Error('Server should return a 200');
      }

      const responseJson = await response.json();

      if (
        responseJson &&
        typeof responseJson === 'object' &&
        'data' in responseJson &&
        responseJson.data &&
        typeof responseJson.data === 'object' &&
        'name' in responseJson.data &&
        responseJson.data.name &&
        typeof responseJson.data.name === 'string'
      ) {
        return responseJson.data.name;
      } else {
        throw new Error('Server responded with unexpected data');
      }
    },
    queryKey: [url],
    enabled: !!url,
  });
}
