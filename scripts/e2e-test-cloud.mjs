#!/usr/bin/env node

import { program } from 'commander'
import { isRunFromCli, getUser } from './helpers.mjs'
import { execa } from 'execa'

if (isRunFromCli(import.meta.url)) {
  program
    .description('Run end-to-end tests locally or in the cloud (BrowserStack)')
    .option('-u, --username [username]', 'BrowserStack username')
    .option('-k, --access-key [accessKey]', 'BrowserStack access key')
    .option('--build-id [buildId]', 'Name/ID of the build')
    .requiredOption('--device <device>', 'Device name to run tests on')
    .requiredOption('--os-version <osVersion>', 'OS version of the device')
    .requiredOption('--app-url <appUrl>', 'URL of the app to test')
    .requiredOption('--app-client-url <appClientUrl>', 'URL of the app client to test')
    .parse()

  const opts = program.opts()
  await runE2ETests(opts)
}

export function runE2ETests({
  device,
  osVersion,
  appUrl,
  appClientUrl,
  buildId,
  ...userOpts
}) {
  const { username, accessKey } = getUser(userOpts)

  const CLI_OPTS = {
    stdio: isRunFromCli(import.meta.url) ? 'inherit' : 'pipe',
    preferLocal: true,
    env: {
      FORCE_COLOR: 'true',
      DEVICE_NAME: device,
      DEVICE_OS_VERSION: osVersion,
      BROWSERSTACK_APP_URL: appUrl,
      BROWSERSTACK_APP_CLIENT_URL: appClientUrl,
      BROWSERSTACK_USERNAME: username,
      BROWSERSTACK_ACCESS_KEY: accessKey,
      BUILD_ID: buildId,
    },
  }

  return execa(CLI_OPTS)`detox test -c android.cloud.release`
}
