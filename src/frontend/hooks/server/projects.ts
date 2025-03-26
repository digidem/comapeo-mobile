import {useMemo} from 'react';
import {
  useProjectSettings as useComapeoProjectSettings,
  useManyMembers,
  useOwnRoleInProject,
} from '@comapeo/core-react';
import {useQuery} from '@tanstack/react-query';

import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const ALL_PROJECTS_KEY = 'all_projects';
export const PROJECT_SETTINGS_KEY = 'project_settings';
export const CREATE_PROJECT_KEY = 'create_project';
export const PROJECT_KEY = 'project';
export const PROJECT_MEMBERS_KEY = 'project_members';
export const ORIGINAL_VERSION_ID_TO_DEVICE_ID_KEY =
  'originalVersionIdToDeviceId';
export const THIS_USERS_ROLE_KEY = 'my_role';
export const REMOTE_ARCHIVE = 'remote_archive';

export function useProjectSettings() {
  const {projectId} = useActiveProject();
  return useComapeoProjectSettings({projectId});
}

export function useGetOwnRole() {
  const {projectId} = useActiveProject();
  return useOwnRoleInProject({projectId});
}

export function useGetRemoteArchives() {
  const {projectId} = useActiveProject();
  const {data: members, error, isRefetching} = useManyMembers({projectId});

  const archives = useMemo(() => {
    return members?.filter(m => m.deviceType === 'selfHostedServer') ?? [];
  }, [members]);

  return {
    data: archives,
    error,
    isRefetching,
  };
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
