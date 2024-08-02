import { Glob } from 'glob'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { program } from 'commander'
import dotenv from 'dotenv'
import { execa } from 'execa'
import crypto from 'crypto'

/**
 * @param {string | string[]} pattern
 * @returns number
 */
export async function getLatestModifiedTime (pattern) {
  const files = new Glob(`${folderPath}/**/*`, { nodir: true })
  let latestModifiedTime = 0
  for await (const file of files) {
    const { mtime } = await fs.promises.stat(file)
    if (mtime > latestModifiedTime) {
      latestModifiedTime = mtime
    }
  }
  return latestModifiedTime
}

export function isRunFromCli (importUrl) {
  return importUrl === `file://${process.argv[1]}`
}

export function getUser(opts) {
  // Load environment variables from a .env file
  dotenv.config()
  const username = opts.username || process.env.BROWSERSTACK_USERNAME
  const accessKey = opts.accessKey || process.env.BROWSERSTACK_ACCESS_KEY

  if (!username) {
    throw new Error(
      'You must either provide a --username option or set BROWSERSTACK_USERNAME in your environment'
    )
  }
  if (!accessKey) {
    throw new Error(
      'You must either provide a --access-key option or set BROWSERSTACK_ACCESS_KEY in your environment'
    )
  }
  return { username, accessKey }
}

/** @param {'app' | 'app client'} name */
export function parseUploadArgs (name) {


  program
    .description(
      `Upload the ${name} APK to BrowserStack for automated testing,
outputs the BrowserStack ${name} URL.

You can set the BrowserStack username and access key as environment variables
BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY, or include them in a \`.env\`
file in the project root directory.
`
    )
    .option('-u, --username [username]', 'BrowserStack username')
    .option('-k, --access-key [accessKey]', 'BrowserStack access key')
    .parse()

  return getUser(program.opts())
}

async function hashGitStatus() {
  const cwd = new URL('..', import.meta.url).pathname
  const { stdout: gitStatus } = await execa({ cwd })`git status --porcelain`
  if (!gitStatus) return

  const readables = []
  readables.push(
    // Staged changes
    execa({ cwd })`git diff --cached`.readable(),
    // Unstaged changes
    execa({ cwd })`git diff`.readable(),
  )
  const untrackedIter = execa({ cwd })`git ls-files --others --exclude-standard`
  for await (const file of untrackedIter) {
    readables.push(fs.createReadStream(path.join(cwd, file)))
  }
  const hash = crypto.createHash('sha256')
  for (const readable of readables) {
    await pipeline(readable, hash, { end: false })
  }
  return hash.digest('hex')
}

// Get a unique code ID for the current commit and working directory status
export async function buildId() {
  const cwd = new URL('..', import.meta.url).pathname
  const { stdout: branch } = await execa({ cwd })`git rev-parse --abbrev-ref HEAD`
  const { stdout: commitHash } = await execa({ cwd })`git rev-parse HEAD`
  let buildId = `${branch}#${commitHash.slice(0, 7)}`
  const workingDirHash = await hashGitStatus()
  if (workingDirHash) {
    buildId += `+${workingDirHash.slice(0, 7)}`
  }
  return buildId
}
