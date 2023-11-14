import { parseArgs } from 'util'

import { init } from './src/app.js'

try {
  const { values } = parseArgs({
    options: {
      version: { type: 'string' },
      rootKey: { type: 'string' },
    },
  })

  if (typeof values.rootKey !== 'string') {
    throw new Error('backend did not receive root key from front end')
  }

  // Do not await this as we want this to run indefinitely
  init({
    version: values.version,
    rootKey: Buffer.from(values.rootKey, 'hex'),
  }).catch((err) => {
    console.error('Server startup error:', err)
  })
} catch (err) {
  console.error('Server startup error:', err)
}
