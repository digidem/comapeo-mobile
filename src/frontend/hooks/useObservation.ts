import {useQuery} from '@tanstack/react-query'
import { useClientApiContext } from '../contexts/ClientApiProvider'

export const useObservation = (id:string) => {
    const clientApi = useClientApiContext()
    return useQuery(['observation', id], ()=>{
        return clientApi.observation.getByDocId(id)
    })
}