import {useQuery} from '@tanstack/react-query';
import {useProjectContext} from '../../../contexts/ProjectContext';

export const useObservationsQuery = () => {
  const project = useProjectContext();

  return useQuery(
    ['observations'],
    async () => await project.observation.getMany(),
  );
};
