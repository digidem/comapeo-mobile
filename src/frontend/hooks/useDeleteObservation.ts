import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClientApiContext } from "../contexts/ClientApiProvider"

export const useDeleteObservation = (id:string) => {
    const clientApi = useClientApiContext()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:async ()=>{await clientApi.observation.delete(id)},
        onSuccess: () => queryClient.invalidateQueries({queryKey:['observations']})
    })
}