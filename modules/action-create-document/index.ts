// Reexport the native module. On web, it will be resolved to CreateDocumentModule.web.ts
// and on native platforms to CreateDocumentModule.ts
export {default} from './src/CreateDocumentModule';
export {default as CreateDocumentView} from './src/CreateDocumentView';
export * from './src/CreateDocument.types';
