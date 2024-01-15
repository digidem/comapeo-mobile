package com.mapeonext;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;
import java.io.File;

// Very tightly scoped native module for surfacing relevant directory paths
public class FileSystemModule extends ReactContextBaseJavaModule {
    FileSystemModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "FileSystemModule";
    }

    // Extracted from https://github.com/itinance/react-native-fs/blob/64aa755cc1d37f59fa205bf2d52dd71a7d691504/android/src/main/java/com/rnfs/RNFSManager.java#L990
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        File externalDirectory = this.getReactApplicationContext().getExternalFilesDir(null);
        if (externalDirectory != null) {
            constants.put("EXTERNAL_FILES_DIR", externalDirectory.getAbsolutePath());
        } else {
            constants.put("EXTERNAL_FILES_DIR", null);
        }

        return constants;
    }
}
