import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {useApi} from '../../contexts/ApiContext';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {PRESETS_KEY} from './presets';
import {ICONS_KEY} from './icons';
import {FIELDS_KEY} from './fields';

export const ALL_PROJECTS_KEY = 'all_projects';
export const PROJECT_SETTINGS_KEY = 'project_settings';
export const CREATE_PROJECT_KEY = 'create_project';
export const PROJECT_KEY = 'project';
export const PROJECT_MEMBERS_KEY = 'project_members';
export const ORIGINAL_VERSION_ID_TO_DEVICE_ID_KEY =
  'originalVersionIdToDeviceId';
export const THIS_USERS_ROLE_KEY = 'my_role';

export function useProject(projectId?: string) {
  const api = useApi();

  return useQuery({
    queryKey: [PROJECT_KEY, projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Active project ID must exist');
      const projectApi = await api.getProject(projectId);

      return {projectId, projectApi};
    },
    enabled: !!projectId,
    placeholderData: previousData => previousData,
  });
}

export function useAllProjects() {
  const api = useApi();

  return useQuery({
    queryKey: [ALL_PROJECTS_KEY],
    queryFn: () => {
      return api.listProjects();
    },
  });
}

export function useCreateProject() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [CREATE_PROJECT_KEY],
    mutationFn: (opts?: Parameters<typeof api.createProject>[0]) => {
      if (opts) {
        return api.createProject(opts);
      } else {
        // Have to avoid passing `undefined` explicitly
        // See https://github.com/digidem/comapeo-mobile/issues/392
        return api.createProject();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_PROJECTS_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [PROJECT_SETTINGS_KEY],
      });
    },
  });
}

export function useProjectMembers() {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: [PROJECT_MEMBERS_KEY, projectId],
    queryFn: () => {
      return projectApi.$member.getMany();
    },
  });
}

export function useProjectSettings() {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: [PROJECT_SETTINGS_KEY, projectId],
    queryFn: () => {
      return projectApi.$getProjectSettings();
    },
  });
}

export const useOriginalVersionIdToDeviceId = (originalVersionId: string) => {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: [
      ORIGINAL_VERSION_ID_TO_DEVICE_ID_KEY,
      projectId,
      originalVersionId,
    ],
    queryFn: async () => {
      return await projectApi.$originalVersionIdToDeviceId(originalVersionId);
    },
  });
};

export function useLeaveProject() {
  const mapeoApi = useApi();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => {
      return mapeoApi.leaveProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_PROJECTS_KEY],
      });
    },
  });
}

export function useImportProjectConfig() {
  const queryClient = useQueryClient();
  const {projectApi} = useActiveProject();

  return useMutation({
    mutationFn: (configPath: string) => {
      return projectApi.importConfig({configPath});
    },
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [FIELDS_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [ICONS_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [PROJECT_SETTINGS_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [PRESETS_KEY],
        }),
      ]);
    },
  });
}

export function useGetOwnRole() {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: [THIS_USERS_ROLE_KEY, projectId],
    queryFn: () => {
      return projectApi.$getOwnRole();
    },
  });
}

export function useAddRemoteArchive() {
  // const {projectApi} = useActiveProject();
  // return useMutation({
  //   mutationFn:({url}:{url:string})=>{
  //     return projectApi.$member.addServer(url)
  //   }
  // }

  return useMutation({
    mutationFn: async ({shouldThrow}: {shouldThrow?: boolean}) => {
      setTimeout(() => {
        if (shouldThrow) throw new Error('Server not added');
        return {};
      }, 1500);
    },
  });
}

export function useFindRemoteArchive({
  shouldThrow,
  url,
}: {
  shouldThrow?: boolean;
  url?: string;
}) {
  // const {projectApi} = useActiveProject();
  // return useMutation({
  //   mutationFn:({url}:{url:string})=>{
  //     return projectApi.$member.findServer(url)
  //   }
  // }

  return useQuery<{url: string; name: string}>({
    queryFn: async () => {
      await new Promise<{url: string; name: string}>((res, rej) => {
        if (!url) {
          rej(new Error('No URL provided'));
          return;
        }
        setTimeout(() => {
          if (shouldThrow) {
            rej(new Error('Server not found'));
            return;
          }
          return res({url, name: 'Some Remote Archive'});
        }, 1500);
      });
    },
    queryKey: [url],
    enabled: !!url,
  });
}
