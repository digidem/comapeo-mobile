const {withAndroidManifest, AndroidConfig} = require('@expo/config-plugins');

// @comapeo/core-react-native and expo-secure-store each set
// android:dataExtractionRules / android:fullBackupContent on <application>,
// which the manifest merger rejects as conflicting. The app sets
// allowBackup=false so these rules are inert, but the merger still fails.
// Resolve by declaring the module's rules on the app <application> and
// telling the merger the app wins. See @comapeo/core-react-native README
// "Backup-rules merge conflict".
module.exports = function withMergeBackupRules(config) {
  return withAndroidManifest(config, config => {
    const manifest = config.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );
    application.$['android:dataExtractionRules'] =
      '@xml/comapeo_data_extraction_rules';
    application.$['android:fullBackupContent'] = '@xml/comapeo_backup_rules';
    application.$['tools:replace'] =
      'android:dataExtractionRules,android:fullBackupContent';

    return config;
  });
};
