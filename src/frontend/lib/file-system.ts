import {NativeModules} from 'react-native';

interface FileSystem {
  getConstants(): {
    EXTERNAL_FILES_DIR: string | null;
  };
}

const FileSystem: FileSystem = NativeModules.FileSystemModule;

const {EXTERNAL_FILES_DIR} = FileSystem.getConstants();

export {FileSystem, EXTERNAL_FILES_DIR};
