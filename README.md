# CoMapeo Mobile

The next version of Mapeo Mobile

## Getting started

1. Clone repository

   ```sh
   git clone https://github.com/digidem/comapeo-mobile.git
   ```

2. Set up the development environment

   1. Install [Node](https://nodejs.org), ideally through a proper node version manager such as [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), [asdf](https://asdf-vm.com/), or [mise](https://mise.jdx.dev/)

      - This project uses **Node v20** with **npm v10**

   2. Follow the React Native instructions for setting up the development environment: https://reactnative.dev/docs/environment-setup

      - Note that **Java 17** is the minimum version required for this project.

      - When setting up the Android-specific tooling, you will also need to install the [Android NDK](https://developer.android.com/ndk/). This can be installed using Android Studio by going to the `SDK Tools` tab in the `SDK Manager`. This project uses **NDK 25.1.8937393**.

   3. Create a `.env` file at the root of the project with the following content:

      ```
      APP_VARIANT=development
      MAPBOX_ACCESS_TOKEN=<access token>
      MAPBOX_DOWNLOAD_TOKEN=<download token>
      COMAPEO_METRICS_URL=<metrics URL>
      COMAPEO_METRICS_API_KEY=<metrics API key>
      ```

      For `MAPBOX_ACCESS_TOKEN`, replace `<access token>` with a [Mapbox access token](https://docs.mapbox.com/android/maps/guides/install/#configure-credentials). If you do not have access to a Mapbox account, reach out to the maintainers about getting access to an access token.

      For `MAPBOX_DOWNLOAD_TOKEN`, replace `<download token>` with a [Mapbox secret token](https://docs.mapbox.com/android/maps/guides/install/#configure-credentials). This is unfortunately required to install the necessary Mapbox Android SDK components used by `@rnmapbox/maps@10` when building the app (more info [here](https://github.com/rnmapbox/maps/blob/v10.0/android/install.md#mapbox-maps-sdk-v10)). If you do not have access to a Mapbox account, reach out to the maintainers about getting access to a secret token.

      For `COMAPEO_METRICS_URL` and `COMAPEO_METRICS_API_KEY`, reach out to the maintainers about getting access to these credentials.

3. Run the app locally

   1. Install dependencies

      - This project requires the following system dependencies. Make sure they are available on your `PATH`.

        - curl
        - tar

      - Install NPM-based project dependencies

        ```sh
        npm install
        ```

   2. Generate the native code

      - This project uses [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/) for generating the relevant native code. If you update [`app.json`](./app.json) or [`app.config.js`](./app.config.js), or install/update any dependencies that provide native code, you should run the following command to make sure the project is up-to-date:

      ```sh
      npx expo prebuild
      ```

      If you have made any manual changes to the generated directories (e.g. `android/` or `ios/`), you may need to specify the `--clean` flag with the command.

   3. Start the Metro bundler process

      ```sh
      npm start
      ```

      Leave this running in a separate terminal window.

   4. Build and run the app (Android)

      - For this project, using a physical device is more convenient and reliable to work with. It is recommended that you follow React Native's [setup instructions](https://reactnative.dev/docs/running-on-device) for running an app on a device.

      - Run the following command to build the backend and then build and run the Android app:

        ```sh
        npm run android
        ```

        If you do not need to rebuild the backend on subsequent runs (e.g. no changes in the `src/backend/` directory), you can use the following command instead:

        ```sh
        npm run android-no-backend-rebuild
        ```

## E2E Testing

This project is tested with BrowserStack.
