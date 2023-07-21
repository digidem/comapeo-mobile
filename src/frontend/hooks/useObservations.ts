import {useQuery} from '@tanstack/react-query'
import { useClientApi } from './useClientApi'

export const useObservations = () => {
    const clientApi = useClientApi()
    return useQuery({ queryKey: ['observations'], queryFn: clientApi?.observation.getMany() })
}