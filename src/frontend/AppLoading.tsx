import * as React from 'react';
import {setItemAsync, getItemAsync} from 'expo-secure-store';
import {getRandomBytes} from 'expo-crypto';
import {Loading} from './sharedComponents/Loading';
import {ProjectProvider} from './contexts/ProjectContext';
import {api} from './api';
import {ProjectDriver} from '../backend/mapeo-core/drivers';

type KeyStoreKey = '@RootKey' | '@ProjectId';

export const AppLoading = ({children}: {children: React.ReactNode}) => {
  const [rootKey, rootKeyStatus, setRootKey] = useSecureStore('@RootKey');
  const [projectKey, projectKeyStatus] = useSecureStore('@ProjectId');
  const [managerReady, setManagerReady] = React.useState(false);
  // if there is no root key, create one
  // The root key should only be create ONCE, on first app load
  if (!rootKey && rootKeyStatus !== 'loading') {
    setRootKey(Utf8ArrayToStr(getRandomBytes(16)));
  }

  if (rootKey && !managerReady) {
    getManagerInitiated(rootKey).then(val => setManagerReady(true));
  }

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      splashScreenHide();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      splashScreenHide();
    };
  }, []);

  if (managerReady || projectKeyStatus === 'loading') {
    return <Loading />;
  }

  return (
    <ProjectProvider secureStoreProjectId={projectKey}>
      {children}
    </ProjectProvider>
  );
};

function useSecureStore(key: KeyStoreKey) {
  const [value, setValue] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'loading'>('loading');

  React.useEffect(() => {
    getItemAsync(key)
      .then(storageVal => {
        setValue(storageVal);
      })
      .finally(() => {
        setStatus('idle');
      });
  }, []);

  const setToSecureStore = React.useCallback((val: string) => {
    setStatus('loading');
    setItemAsync(key, val)
      .then(() => {
        // if successful, we know that the rootkey = val
        setValue(val);
      })
      .finally(() => {
        setStatus('idle');
      });
  }, []);

  return [value, status, setToSecureStore] as const;
}

function splashScreenHide() {
  return;
}

async function getManagerInitiated(rootKey: string) {
  return true;
}

// this will be an ipc call
// front end expects backend to useRootKey to initialize/retrieve Manager. Manager should take the projectId and find that project. If projectId is null, create a project. Send back project Id
async function mockSendToBackEnd(rootKey: string, projectId: string | null) {
  return api.manager.getProject(projectId);
}

// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function Utf8ArrayToStr(array: Uint8Array) {
  var out, i, len, c;
  var char2, char3;

  out = '';
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
        );
        break;
    }
  }

  return out;
}
