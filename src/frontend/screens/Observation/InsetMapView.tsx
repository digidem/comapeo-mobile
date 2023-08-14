import { useObservation } from "../../hooks/useObservation"

export const InsetMapView = ({observationId}:{observationId:string}) => {
    const {data, isLoading} = useObservation(observationId)

    if(isLoading){

    }

    return(
        <
    )

}