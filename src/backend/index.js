import { parseArgs } from 'util'

import { init } from './src/app.js'

/** @type {import('util').ParseArgsConfig['options']} */
const options = {
  version: { type: 'string' },
}

try {
  const args = parseArgs({ options })

  const { values } = args

  // Do not await this as we want this to run indefinitely
  init({
    version: typeof values.version === 'string' ? values.version : undefined,
  }).catch((err) => {
    console.error('Server startup error:', err)
  })
} catch (err) {
  console.error('Server startup error:', err)
}
