// This file sets up some global variables that are incorrectly set in
// nodejs-mobile, e.g. the cwd points to root ("/") on mobile, so we override it
// with the nodejs project dir

import * as Sentry from '@sentry/node'
import { makeOfflineSqliteTransport } from 'sentry-offline-transport-better-sqlite'
import Database from 'better-sqlite3'

import parseArgs from './src/args.js'

import os from 'os'
import path from 'path'
import { createRequire } from 'module'
import debug from 'debug'
import { formatWithOptions } from 'node:util'

/** @typedef {Parameters<import('@sentry/node').makeNodeTransport>[0]} NodeTransportOptions */

const require = createRequire(import.meta.url)
/** @type {import('./types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

const DB_DIR_NAME = 'sentry-logs'
const privateStorageDir = rnBridge.app.datadir()
const dbDir = path.join(privateStorageDir, DB_DIR_NAME)

const nodejsProjectDir = path.resolve(rnBridge.app.datadir(), 'nodejs-project')
os.homedir = () => nodejsProjectDir
process.cwd = () => nodejsProjectDir
process.env = process.env || {}

const { sentryEnvironment, sentryUserId, metricsIsEnabled } = parseArgs()

const sentryDebug = sentryEnvironment === 'development'
const initialScope = sentryUserId ? { user: { id: sentryUserId } } : undefined

/** @type {Array<"error" | "log" | "warn">} */
const logLevels = ['error']
let enableLogs = false

if (sentryEnvironment !== 'production') {
  logLevels.push('log', 'warn')
  enableLogs = true
}

const sentryDB = new Database(dbDir)

if (enableLogs) {
  // needed to have logs captured by sentry
  debug.log = function log(...args) {
    // @ts-expect-error InspectOpts shouldn't be undefined but might be
    return console.log(formatWithOptions(debug.inspectOpts || {}, ...args))
  }
  // This has a high overhead, so we don't want to do this in production
  debug.enable('mapeo:*')
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
    enableLogs,
    beforeSendLog: (log) => {
      if (!log.attributes) log.attributes = {}
      log.attributes.user = { id: sentryUserId }
      return log
    },
  },
  tracesSampleRate: 1.0,
  integrations: [Sentry.consoleLoggingIntegration({ levels: logLevels })],
  transport: (opts /** @type NodeTransportOptions */) =>
    makeOfflineSqliteTransport({ ...opts, db: sentryDB }),
})

// Dynamic import so that Sentry can instrument the code before it runs
await import('./index.js')
