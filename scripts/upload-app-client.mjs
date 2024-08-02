#!/usr/bin/env node

import { execa } from 'execa'
import { parseUploadArgs, isRunFromCli } from './helpers.mjs'

const APP_CLIENT_UPLOAD_URL = 'https://api-cloud.browserstack.com/app-automate/detox/v2/android/app-client'
const APP_CLIENT_FILEPATH = new URL('../android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk', import.meta.url).pathname

if (isRunFromCli(import.meta.url)) {
  const url = await uploadAppClient(parseUploadArgs('app client'))
  process.stdout.write(url)
}

export async function uploadAppClient({ username, accessKey }) {
  const { stdout } = await execa({
    stderr: isRunFromCli(import.meta.url) ? 'inherit' : 'pipe',
  })`curl -u ${username}:${accessKey} -X POST ${APP_CLIENT_UPLOAD_URL} -F file=@${APP_CLIENT_FILEPATH}`

  return JSON.parse(stdout).app_client_url
}
