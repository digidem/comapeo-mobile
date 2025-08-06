import {NativeModule, requireNativeModule} from 'expo';

import {CreateDocumentModuleEvents} from './CreateDocument.types';

export type SharingOptions = {
  /**
   * Sets `mimeType` for `Intent`.
   * @platform android
   */
  mimeType?: string;
  /**
   * Sets default filename
   */
  filename?: string;
};

declare class CreateDocumentModule extends NativeModule<CreateDocumentModuleEvents> {
  save(url: string, options?: SharingOptions): Promise<void>;
}

// This call loads the native module object from the JSI.
const {save: saveDocument} =
  requireNativeModule<CreateDocumentModule>('CreateDocument');

export {saveDocument};
