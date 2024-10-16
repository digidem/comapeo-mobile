import path from 'node:path';
import fs from 'node:fs';

const PROJECT_ROOT_DIR_PATH = new URL('../', import.meta.url).pathname;

const manifestPath = path.join(
  PROJECT_ROOT_DIR_PATH,
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml'
);

function removeActivityRecognitionPermission() {
  if (fs.existsSync(manifestPath)) {
    let manifestContent = fs.readFileSync(manifestPath, 'utf8');

    // Remove the permission
    manifestContent = manifestContent.replace(
      /<uses-permission[\s\S]*?android:name="com\.google\.android\.gms\.permission\.ACTIVITY_RECOGNITION"[\s\S]*?\/>/g,
      ''
    );

    // Write the updated content back
    fs.writeFileSync(manifestPath, manifestContent, 'utf8');
    console.log('Removed android.permission.ACTIVITY_RECOGNITION from AndroidManifest.xml');
  } else {
    console.log('AndroidManifest.xml not found!');
  }
}

removeActivityRecognitionPermission();