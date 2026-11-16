import {createContext} from 'react';

export const ListContext = createContext({});

if (process.env.NODE_ENV !== 'production') {
  ListContext.displayName = 'ListContext';
}
