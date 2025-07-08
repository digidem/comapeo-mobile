# Expo Config Plugins

This folder contains custom Expo config plugins used to modify the native Android build settings.

## `increaseJavaMemory.js`

This plugin increases the allocated Java heap space for Gradle when building the Android app.

### Why is this needed?

During the Android build process, the Gradle daemon can run out of memory, causing errors such as:

```
Java heap space java.lang.OutOfMemoryError: Java heap space
Execution failed for task ':app:mergeDexRelease'.
```

To prevent these errors, we increase the JVM memory allocation using:

```
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
```

This ensures that builds run reliably in CI environments like GitHub Actions, where memory constraints can lead to failures.
