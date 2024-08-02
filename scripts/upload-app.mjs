#!/usr/bin/env node

import { execa } from 'execa'
import { parseUploadArgs, isRunFromCli } from './helpers.mjs'
import 'dotenv/config'

const APP_UPLOAD_URL =
  'https://api-cloud.browserstack.com/app-automate/detox/v2/android/app'
const APP_FILEPATH = new URL(
  '../android/app/build/outputs/apk/release/app-release.apk',
  import.meta.url
).pathname

if (isRunFromCli(import.meta.url)) {
  const url = uploadApp(parseUploadArgs('app'))
  process.stdout.write(url)
}

export async function uploadApp({ username, accessKey }) {
  const { stdout } = await execa({
    stderr: isRunFromCli(import.meta.url) ? 'inherit' : 'pipe',
  })`curl -u ${username}:${accessKey} -X POST ${APP_UPLOAD_URL} -F file=@${APP_FILEPATH}`

  return JSON.parse(stdout).app_url
}
