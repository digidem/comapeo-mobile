import {useQuery} from '@tanstack/react-query'
import { useClientApiContext } from '../contexts/ClientApiProvider'

export const useObservations = () => {
    const clientApi = useClientApiContext()
    return useQuery(['observations'], async()=> await clientApi.observation.getMany())
}