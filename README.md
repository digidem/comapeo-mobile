# React Native + Mapeo Core Next Example

> Minimal(ish) example of integrating [Mapeo Core Next](https://github.com/digidem/mapeo-core-next) into React Native

## How to run on Android

1. Pre-requisites needed:

   - Follow instructions for setting up dev environment: https://reactnative.dev/docs/environment-setup

2. Install deps: `npm install`

3. Build the backend that's loaded into the app using nodejs-mobile: `scripts/build-backend.sh`

4. (optional) Start the React Native process: `npm run start`

5. Build and run the Android app: `npm run android`

   - This will start the React Native process if step (4) was skipped
   - **IMPORTANT**: JDK 11 is required to build the app. If your JDK 11 installation isn't the default (can check by seeing the output of `java -version`) there are a few options (ordered by convenience):

     1. Set up JDK 11 to be the default JDK version used.

        - Pro: Convenient. Never have to worry about specific files or specifying environment variables.

        - Con: If you work on other projects on the same machine that need a different version as the default.

     2. Add the following to `android/gradle.properties`:

        ```gradle
        org.gradle.java.home=/path/to/your/jdk/home
        ```

        - Pro: Any Gradle command for this project will pick this up, so no need to specify an environment variable each time.

        - Con: If this project is shared and used by other people, the path you specify may very likely differ for them and thus affect their usage.

     3. Specify the `JAVA_HOME` environment variable when running the command i.e. `JAVA_HOME=/path/to/your/jdk/home npm run android`.

        - Pro: Least disruptive.

        - Con: Have to manually specify this each time a Gradle command for this project is ran (or export it for the shell process)
