import {useQuery} from '@tanstack/react-query'
import { useClientApi } from './useClientApi'

export const useObservation = (id:string) => {
    const clientApi = useClientApi()
    return useQuery(['observation', id], ()=>{
        return clientApi?.observation.getByDocId(id)
    })
}