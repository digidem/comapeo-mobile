import {useQuery} from '@tanstack/react-query';

export const useAllProjects = (listSeveral?: boolean) => {
  return useQuery({
    queryFn: async () => await mockListProjectApi(listSeveral),
    queryKey: ['projects'],
  });
};

async function mockListProjectApi(listSeveral?: boolean) {
  if (listSeveral) {
    return [
      {projectId: 'ansi3qgr', projectName: 'someProject'},
      {projectId: 'a24t3gqgr', projectName: 'anotherProject'},
    ];
  }

  return [{projectId: 'ansi3qgr', projectName: 'someProject'}];
}
