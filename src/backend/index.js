import { parseArgs } from 'util'

import { init } from './src/app.js'

/** @type {import('util').ParseArgsConfig['options']} */
const options = {
  version: { type: 'string' },
}

try {
  const args = parseArgs({ options })

  const { values } = args

  await init({
    version: typeof values.version === 'string' ? values.version : undefined,
  })
} catch (err) {
  console.log('Server startup error:', err)
}
