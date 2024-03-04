# CoMapeo Mobile

The next version of Mapeo Mobile

## How to run on Android

1. Pre-requisites:

   - Install [Node](https://nodejs.org), ideally through a proper node version manager such as [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), [asdf](https://asdf-vm.com/), or [mise](https://mise.jdx.dev/).
     - This project currently uses **Node v20** with **npm v10**
   - Follow instructions for setting up dev environment: https://reactnative.dev/docs/environment-setup

2. Install deps: `npm install`

3. (optional) Start the React Native process: `npm run start`

4. Build and run the Android app: `npm run android`

   - This will start the React Native process if step (3) was skipped
   - **IMPORTANT**: **Java 17** is required to build the app.
