import React from 'react'

export const ListContext = React.createContext({})

if (process.env.NODE_ENV !== 'production') {
  ListContext.displayName = 'ListContext'
}
