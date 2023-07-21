
import * as React from 'react'
import { useObservations } from '../../hooks/useObservations'

export const ObservationsList = () => {
    const {data, isLoading} = useObservations()

    if (isLoading){
        return (
            <React.Fragment>
                Loading
            </React.Fragment>
        )
    }


}