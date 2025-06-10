// This file sets up some global variables that are incorrectly set in
// nodejs-mobile, e.g. the cwd points to root ("/") on mobile, so we override it
// with the nodejs project dir

import os from 'os'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('./types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

const nodejsProjectDir = path.resolve(rnBridge.app.datadir(), 'nodejs-project')
os.homedir = () => nodejsProjectDir
process.cwd = () => nodejsProjectDir
process.env = process.env || {}

const Sentry = require('@sentry/node')

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: 'https://5326989762cd5899283975f5459524c1@o4507148235702272.ingest.us.sentry.io/4509442300641281',

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
  _experiments: { enableLogs: true },
  tracesSampleRate: 1.0,
  integrations: [
    // send console.log, console.error, and console.warn calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
  ],
})

import './index.js'
