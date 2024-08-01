import 'dotenv/config'
import {execa} from 'execa';

const APP_UPLOAD_URL = 'https://api-cloud.browserstack.com/app-automate/detox/v2/android/app';
const APP_CLIENT_UPLOAD_URL = 'https://api-cloud.browserstack.com/app-automate/detox/v2/android/app-client'
const APP_FILEPATH = new URL('../android/app/build/outputs/apk/release/app-release.apk', import.meta.url).pathname
const APP_CLIENT_FILEPATH = new URL('../android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk', import.meta.url).pathname

if (!process.env.BROWSERSTACK_USERNAME) {
  throw new Error('BROWSERSTACK_USERNAME is not set');
}

if (!process.env.BROWSERSTACK_ACCESS_KEY) {
  throw new Error('BROWSERSTACK_ACCESS_KEY is not set');
}

const userPwd = `${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`

console.log('Uploading app to BrowserStack...')
const appUploadResult = await execa`curl -u ${userPwd} -X POST ${APP_UPLOAD_URL} -F file=@${APP_FILEPATH}`
console.log('Uploading app client to BrowserStack...')
const appClientUploadResult = await execa`curl -u ${userPwd} -X POST ${APP_CLIENT_UPLOAD_URL} -F file=@${APP_CLIENT_FILEPATH}`

const appUrl = JSON.parse(appUploadResult.stdout).app_url
const appClientUrl = JSON.parse(appClientUploadResult.stdout).app_client_url

const env = {
  BROWSERSTACK_APP_URL: appUrl,
  BROWSERSTACK_APP_CLIENT_URL: appClientUrl,
  FORCE_COLOR: '1',
}

console.log('Installing patched detox...')
await execa`npm i --no-save detox@npm:@avinashbharti97/detox@^20.1.2`
console.log('Running detox tests...')
await execa({ preferLocal: true, env, stderr: 'inherit' })`detox test -c android.cloud.release`
console.log('Re-installing latest (unpatched) detox...')
await execa`npm i --no-save detox`
