import {type MapeoClient} from '../backend/mapeo-core';
import {type ClientApi} from 'rpc-reflector/client';

// In practice, this is a singleton for the frontend api client
// It gets set in the Loading component
let api: ClientApi<MapeoClient>;

function setApi(a: ClientApi<MapeoClient>) {
  api = a;
}

export {api, setApi};
