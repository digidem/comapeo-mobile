#!/usr/bin/env node

import prompts from 'prompts'
import { execa, parseCommandString } from 'execa'
import { program } from 'commander'
import fs from 'fs/promises'
import { Listr } from 'listr2'
import { buildId, getUser, isRunFromCli } from '../scripts/helpers.mjs'
import { uploadApp } from '../scripts/upload-app.mjs'
import { uploadAppClient } from '../scripts/upload-app-client.mjs'
import { runE2ETests } from '../scripts/e2e-test-cloud.mjs'

program
  .description('Run end-to-end tests locally or in the cloud (BrowserStack)')
  .option('-u, --username [username]', 'BrowserStack username')
  .option('-k, --access-key [accessKey]', 'BrowserStack access key')
  .parse()

const deviceList = JSON.parse(
  await fs.readFile(new URL('../e2e/devices.json', import.meta.url))
)

const deviceChoices = deviceList.map(device => ({
  title: `${device.name} (${device.osVersion})`,
  value: device
}))

const response = await prompts([
  {
    type: 'toggle',
    name: 'rebuild',
    message: 'Rebuild app?',
    initial: false,
    active: 'yes',
    inactive: 'no'
  },
  {
    type: 'select',
    name: 'testType',
    message: 'Run tests locally or in the cloud?',
    choices: [
      { title: 'Local', value: 'local' },
      { title: 'Cloud', value: 'cloud' }
    ]
  },
  {
    type: prev => (prev === 'cloud' ? 'multiselect' : null),
    name: 'devices',
    message: 'Select devices to run tests on',
    min: 1,
    optionsPerPage: 20,
    choices: deviceChoices
  }
])

process.stdout.write('\n\n')

if (response.testType === 'cloud') {
  const { username, accessKey } = getUser(response)
  response.username = username
  response.accessKey = accessKey
}

const CLI_OPTS = {
  preferLocal: true,
  env: {
    FORCE_COLOR: 'true'
  }
}

const cloudTasks =
  response.testType === 'cloud' &&
  response.devices.map(device => ({
    title: `Test ${device.name} (${device.osVersion})`,
    task: async ({ appUrl, appClientUrl }, task) => {
      const execute = runE2ETests({
        device: device.name,
        osVersion: device.osVersion,
        appUrl,
        appClientUrl,
        username: response.username,
        accessKey: response.accessKey,
        buildId: await buildId()
      })
      execute.stderr.pipe(task.stdout())
      await execute
    },
    rendererOptions: { persistentOutput: true, bottomBar: true }
  }))

const tasks = new Listr([
  {
    title: 'Rebuild app',
    enabled: () => response.rebuild,
    task: (ctx, task) =>
      task.newListr([
        {
          title: 'Ensure original version of detox is installed',
          task: cliTask('npm install --no-save detox')
        },
        {
          title: 'Build app',
          task: async (ctx, task) => {
            const execute = execa`npm run build:test`
            execute.stdout.pipe(task.stdout())
            await execute
          }
        }
      ])
  },
  {
    title: 'Upload app to BrowserStack',
    enabled: () => response.testType === 'cloud',
    task: (ctx, task) =>
      task.newListr(
        [
          {
            title: 'Uploading app',
            task: async ctx => {
              ctx.appUrl = await uploadApp(response)
            }
          },
          {
            title: 'Uploading app client',
            task: async ctx => {
              ctx.appClientUrl = await uploadAppClient(response)
            }
          }
        ],
        {
          concurrent: true
        }
      )
  },
  {
    title: 'Run tests on attached device/emulator',
    enabled: () => response.testType === 'local',
    task: cliTask('npm run test:e2e-local'),
    rendererOptions: { persistentOutput: true, bottomBar: Infinity }
  },
  {
    title: 'Install patched version of detox',
    enabled: () => response.testType === 'cloud',
    task: cliTask('npm i --no-save detox@npm:@avinashbharti97/detox@^20.1.2')
  },
  {
    title: 'Run tests on BrowserStack',
    enabled: () => response.testType === 'cloud',
    task: async (ctx, task) =>
      task.newListr(cloudTasks, {
        concurrent: 5,
        rendererOptions: { collapseSubtasks: false }
      }),
    rollback: cliTask('npm install --no-save detox')
  },
  {
    title: 'Re-install unmodified version of detox',
    enabled: () => response.testType === 'cloud',
    task: cliTask('npm install --no-save detox')
  }
])

await tasks.run()

function cliTask (cmd) {
  return async function (ctx, task) {
    const cmdArray = parseCommandString(cmd)
    const execute = execa(CLI_OPTS)`${cmdArray}`
    execute.stdout.pipe(task.stdout())
    await execute
  }
}
