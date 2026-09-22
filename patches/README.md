# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to fix dependency bugs that have no released
fix. They are applied by the `postinstall` script.

A patch that edits an **Expo** module's Android sources only takes effect if that module is listed in
`expo.autolinking.buildFromSource` in `package.json`. Expo SDK 56 links most of its Android modules as precompiled
Maven AARs, so otherwise the patch applies cleanly, the build succeeds, and the patched code never reaches the APK.
Confirm with a `Task :<module>:compileDebugKotlin` line in the Gradle log.

## @maplibre/maplibre-react-native

### [New Architecture and RN 0.85 fixes](./@maplibre+maplibre-react-native+10.4.2.patch)

`EventEmitter` reached the React context via `ReactApplication#getReactNativeHost()`, which throws under the New
Architecture. The `ReactApplicationContext` it is handed is already a live `ReactContext`, so it is used directly.

`AnimatedPoint` also assigned its own listener map to `this._listeners`, which RN 0.85 changed from a plain object to a
`Map` on `AnimatedNode`; the subclass now keeps its listeners in `_pointListeners` so `__callListeners` still finds a
real `Map`.

## expo-file-system

### [Cache the SAF content length](./expo-file-system+56.0.8+001+cache-saf-content-length.patch)

`CountingSink.write` called `RequestBody.contentLength()` on every 8 KiB segment. For a `content://` URI from the
document picker that resolves to `SAFDocumentFile.length()` — a `ContentResolver` query over binder — so a 294 MB
upload made ~36,000 cross-process round-trips. Importing a custom map ran at 1.8 MB/s and looked like a hang on
low-end phones. The length is now resolved once, both in `CountingRequestBody` and in the `UnifiedFileInterface`
request body. The same import drops to ~3.1 s (~96 MB/s). Android only; iOS uploads via
`URLSession.uploadTask(fromFile:)`.

### [Read uploads in 64 KiB chunks](./expo-file-system+56.0.8+002+buffer-upload-reads.patch)

`sink.writeAll(input.source())` makes okio pull one 8 KiB segment per read from the source file descriptor. Reading
64 KiB at a time cuts read syscalls eightfold on the content-provider fd. Worth ~13% of app-process CPU during an
import; it does not move wall-clock on an emulator that is not CPU-bound, but should on a constrained phone.

Both fixes are unreleased upstream as of expo-file-system 57.0.1.

## react-native-confirmation-code-field

### [Fix mask symbol logic issue](./react-native-confirmation-code-field+9.0.0+001+fix-mask-symbol-logic-issue.patch)

Fixes a bug in the `MaskSymbol` component where the mask (`*`) briefly un-hides when typing quickly. This patch sets the
`visibleFlag` to `false` immediately, preventing the undesired flicker.

See: [Reviewer context](https://github.com/digidem/comapeo-mobile/pull/1225).

## react-native-vision-camera

### [Fix camera device list startup race](./react-native-vision-camera+4.7.3+001+fix-camera-devices-startup-race.patch)

`CameraDevicesManager` sends its device list to JS only at startup, but builds that list from `cameraProvider` and
`extensionsManager`, which initialise asynchronously and yield an empty list until both are set. When initialisation
loses that race, JS caches the empty list and nothing ever re-emits, so `useCameraDevice()` returns `undefined` — and the
camera screen stays unavailable — until the app is restarted. This patch emits `CameraDevicesChanged` once
initialisation completes, and re-sends the current list when JS subscribes, since events emitted before then are
dropped.

Fixed upstream in v5, which requires the New Architecture. 4.7.3 is the final 4.x release, so there is nothing to
upgrade to.

## react-native-zeroconf

### [Drop the rx2dnssd implementation](./react-native-zeroconf+0.13.8+001+initial.patch)

Removes `DnssdImpl` and its `com.github.andriydruk:rx2dnssd` dependency. We only ever use the `NSD` implementation, and
the unused one pulls in a native library and a JitPack repository we would otherwise have to keep resolvable.

### [Report publish and unpublish failures](./react-native-zeroconf+0.13.8+001+notify-publish-unpublish-errors.patch)

`NsdManager`'s `onRegistrationFailed` and `onUnregistrationFailed` callbacks were empty, so a service that failed to
publish looked identical to one still waiting. These now emit `RNZeroconfServiceRegisterError` /
`RNZeroconfServiceUnregisterError`, surfaced in JS as `publishError` and `unpublishError`. The patch also replaces the
minified `dist/index.js` with readable source so the new listeners can be wired up.

### [Type the new error events](./@types+react-native-zeroconf+0.13.1.patch)

Adds `publishError` and `unpublishError` overloads to the `Zeroconf#on` declarations, matching the patch above.
