const path = require('path');
const fs = require('fs-extra');
const {withDangerousMod, createRunOncePlugin} = require('@expo/config-plugins');

function withFlagSecureModule(config) {
  return withDangerousMod(config, [
    'android',
    async config => {
      const androidRoot = config.modRequest.platformProjectRoot;

      // Copy .java files to the android folder
      await copyJavaFiles(androidRoot);

      // Patch the actual MainApplication.(kt|java)
      // We'll get the final package name from config.android.package
      const androidPackage = config.android?.package ?? 'com.comapeo';
      await patchMainApplication(androidRoot, androidPackage);

      return config;
    },
  ]);
}

async function copyJavaFiles(androidRoot) {
  const moduleSrc = path.join(__dirname, 'FlagSecureModule.java');
  const packageSrc = path.join(__dirname, 'FlagSecurePackage.java');

  const moduleDest = path.join(
    androidRoot,
    'app',
    'src',
    'main',
    'java',
    'com',
    'comapeo',
    'flagsecure',
    'FlagSecureModule.java',
  );
  const packageDest = path.join(
    androidRoot,
    'app',
    'src',
    'main',
    'java',
    'com',
    'comapeo',
    'flagsecure',
    'FlagSecurePackage.java',
  );

  await fs.copy(moduleSrc, moduleDest);
  await fs.copy(packageSrc, packageDest);
}

/**
 * Patch MainApplication.(kt|java) in the android code:
 *  - Insert an import for FlagSecurePackage
 *  - Insert packages.add(FlagSecurePackage()) in getPackages()
 */
async function patchMainApplication(androidRoot, androidPackage) {
  // Convert "com.comapeo.dev" => ["com","comapeo","dev"] for example
  const segments = androidPackage.split('.');
  // So your MainApplication is at: android/app/src/main/java/com/comapeo/dev/MainApplication.kt for example
  const appJavaDir = path.join(
    androidRoot,
    'app',
    'src',
    'main',
    'java',
    ...segments,
  );

  const candidates = await fs.readdir(appJavaDir);
  const mainApp = candidates.find(
    f =>
      f.startsWith('MainApplication') &&
      (f.endsWith('.java') || f.endsWith('.kt')),
  );
  if (!mainApp) {
    console.warn(`Could not find MainApplication in ${appJavaDir}`);
    return;
  }

  const mainAppPath = path.join(appJavaDir, mainApp);
  let contents = await fs.readFile(mainAppPath, 'utf8');

  // Insert import if missing
  const importLine = 'import com.comapeo.flagsecure.FlagSecurePackage';
  if (!contents.includes(importLine)) {
    const packageDecl = /^package .*[\r\n]+/m;
    if (packageDecl.test(contents)) {
      contents = contents.replace(
        packageDecl,
        match => match + `${importLine}\n`,
      );
    } else {
      contents = `${importLine}\n${contents}`;
    }
  }

  // We need to call `packages.add(FlagSecurePackage())`.
  // For Kotlin, that means "packages.add(FlagSecurePackage())"
  const packageLine = 'packages.add(FlagSecurePackage())';
  if (!contents.includes(packageLine)) {
    const match = 'val packages = PackageList(this).packages';
    if (contents.includes(match)) {
      contents = contents.replace(
        'return packages',
        `${packageLine}\n    return packages`,
      );
    } else {
      contents = contents.replace(
        /(return packages[\s;]+)/,
        `${packageLine}\n    $1`,
      );
    }
  }

  await fs.writeFile(mainAppPath, contents, 'utf8');
}

module.exports = createRunOncePlugin(
  withFlagSecureModule,
  'with-flag-secure-module',
  '1.0.0',
);
