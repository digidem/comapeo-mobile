import * as React from 'react';
import { ClientApi } from 'rpc-reflector';
import { MapeoApi } from '../../backend/mapeo-core';
import { initClientApi } from '../lib/ClientApi';

const ClientApiContext = React.createContext<ClientApi<MapeoApi>|undefined>(undefined)

export const useClientApiContext = ()=>{
    const clientApi = React.useContext(ClientApiContext)
    if(!clientApi){
        throw new Error("Client Api is undefined")
    }
    return clientApi
} 

export function ClientApiProvider({ children}:{children:React.ReactNode}) {
    const client = initClientApi()
    console.log("Render")
    return (
      <ClientApiContext.Provider value={client}>
        {children}
      </ClientApiContext.Provider>
    )
  }
  

