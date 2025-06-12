// This file sets up some global variables that are incorrectly set in
// nodejs-mobile, e.g. the cwd points to root ("/") on mobile, so we override it
// with the nodejs project dir

import * as Sentry from '@sentry/node'
import os from 'os'
import path from 'path'
import { parseArgs } from 'util'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('./types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

const nodejsProjectDir = path.resolve(rnBridge.app.datadir(), 'nodejs-project')
os.homedir = () => nodejsProjectDir
process.cwd = () => nodejsProjectDir
process.env = process.env || {}

const { values } = parseArgs({
  options: {
    sentryEnvironment: { type: 'string' },
    sentryUserId: { type: 'string' },
    metricsIsEnabled: { type: 'boolean' },
  },
  strict: false,
})

const { sentryEnvironment, sentryUserId, metricsIsEnabled } = values

if (typeof metricsIsEnabled !== 'boolean')
  throw new Error('backend did not receive metricsIsEnabled')
if (typeof sentryUserId !== 'string')
  throw new Error('backend did not receive sentryUserId')
if (typeof sentryEnvironment !== 'string')
  throw new Error('backend did not receive sentryEnvironment')

const sentryDebug = sentryEnvironment === 'development'
const initialScope = sentryUserId ? { user: { id: sentryUserId } } : undefined

const logLevels = ['error']

if (sentryEnvironment !== 'production') {
  logLevels.push('log', 'warn')
}

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: 'https://5326989762cd5899283975f5459524c1@o4507148235702272.ingest.us.sentry.io/4509442300641281',

  enabled: metricsIsEnabled,
  sendDefaultPii: false,
  debug: sentryDebug,
  environment: sentryEnvironment,
  initialScope,
  _experiments: {
    enableLogs: true,
    beforeSendLog: (log) => {
      if (!log.attributes) log.attributes = {}
      log.attributes.user = { id: sentryUserId }
      return log
    },
  },
  tracesSampleRate: 1.0,
  // @ts-expect-error Unclear where to import type from their docs
  integrations: [Sentry.consoleLoggingIntegration({ levels: logLevels })],
})

// Dynamic import so that Sentry can instrument the code before it runs
await import('./index.js')
