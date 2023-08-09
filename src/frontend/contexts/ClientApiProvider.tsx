import * as React from 'react';
import { ClientApi } from 'rpc-reflector';
import { MapeoApi } from '../../backend/mapeo-core';

const ClientApiContext = React.createContext<ClientApi<MapeoApi>|undefined>(undefined)

export const useClientApiContext = ()=>{
    const clientApi = React.useContext(ClientApiContext)
    if(!clientApi){
        throw new Error("Client Api is undefined")
    }
    return clientApi
} 

export function ClientApiProvider({ children, client}:{children:React.ReactNode, client:ClientApi<MapeoApi>}) {
  
    return (
      <ClientApiContext.Provider value={client}>
        {children}
      </ClientApiContext.Provider>
    )
  }
  

