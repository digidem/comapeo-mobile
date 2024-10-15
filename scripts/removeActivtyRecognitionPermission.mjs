const fs = require('fs');
const path = require('path');

const manifestPath = path.join(
  __dirname,
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
      /<uses-permission android:name="android\.permission\.ACTIVITY_RECOGNITION"\s*\/>/,
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