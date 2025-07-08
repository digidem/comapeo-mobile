import { parseArgs } from 'util'

export default function args() {
  const { values } = parseArgs({
    options: {
      sentryEnvironment: { type: 'string' },
      sentryUserId: { type: 'string' },
      metricsIsEnabled: { type: 'boolean', default: false },
      version: { type: 'string' },
      rootKey: { type: 'string' },
    },
    strict: true,
  })

  const {
    sentryEnvironment,
    sentryUserId,
    metricsIsEnabled,
    version,
    rootKey,
  } = values

  if (typeof metricsIsEnabled !== 'boolean')
    throw new Error('backend did not receive metricsIsEnabled')
  if (typeof sentryUserId !== 'string')
    throw new Error('backend did not receive sentryUserId')
  if (typeof sentryEnvironment !== 'string')
    throw new Error('backend did not receive sentryEnvironment')
  if (typeof rootKey !== 'string')
    throw new Error('backend did not receive root key from front end')

  return { sentryEnvironment, sentryUserId, metricsIsEnabled, version, rootKey }
}
