## Sodium Native issues

- Attempted to add support for cross-compiling to Android but with no success (see [`src/backend/patches/sodium-native+3.4.1.patch`](./src/backend/patches/sodium-native%2B3.4.1.patch)). Created [Sodium Native issue](https://github.com/sodium-friends/sodium-native/issues/171)

  - I have commented-out changes in the patch to do something similar to what [`sodium-native-nodejs-mobile`](https://github.com/staltz/sodium-native-nodejs-mobile) does. It probably would work but needs some obscure additional steps (need to see what Manyverse does).

- Attempted to just replace `sodium-native` and `sodium-universal` with `sodium-javascript`. `sodium-universal` already points to `sodium-javascript`, except it only does so using the `browser` field in `package.json`. Not aware of how to take advantage of that with Rollup that doesn't affect other modules, but maybe there's a straightforward way.

  - Using [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace), I replace `sodium-universal` and `sodium-native` with `sodium-javascript`, which seems to work in terms of proper resolution. There's probably a better way of doing this in Rollup but I'm not aware of it. Unfortunately, the following error occurs when trying to start the node process:

    ```sh
    01-19 13:48:09.181 14127 14199 E nodejs  : /data/data/com.mapeonext/files/nodejs-project/index.js:17860
    01-19 13:48:09.181 14127 14199 E nodejs  :   sodium$2.crypto_pwhash(masterKey,
    01-19 13:48:09.181 14127 14199 E nodejs  :            ^
    01-19 13:48:09.181 14127 14199 E nodejs  :
    01-19 13:48:09.181 14127 14199 E nodejs  : TypeError: sodium$2.crypto_pwhash is not a function
    ```

    It makes sense after looking at the compat matrix [here](https://github.com/sodium-friends/sodium-universal). Looks like [`mapeo-crypto`](https://github.com/digidem/mapeo-crypto/blob/main/lib/key-utils.js#L45) relies on Sodium Native directly. Basically, seems like we'll need to rely on getting Sodium Native to build properly if we want this to work.
