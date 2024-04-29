export default ({config}) => {
  const IDENTIFIER_SUFFIX =
    {development: '.dev', production: '', test: '.test'}[
      process.env.APP_VARIANT
    ] ?? '';

  const NAME_SUFFIX =
    {development: ' (DEV)', production: '', test: ' (TEST)'}[
      process.env.APP_VARIANT
    ] ?? '';

  return {
    ...config,
    jsEngine: 'hermes',
    name: 'CoMapeo' + NAME_SUFFIX,
    slug: 'comapeo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#050F77',
    },
    assetBundlePatterns: ['**/*'],
    plugins: [
      'expo-localization',
      'expo-secure-store',
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMapboxMapsVersion: '11.1.0',
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN,
        },
      ],
      [
        'expo-location',
        {
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
          microphonePermission:
            'Allow $(PRODUCT_NAME) to access your microphone',
          recordAudioAndroid: true,
        },
      ],
    ],
    android: {
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#0033CC',
      },
      package: 'com.comapeo' + IDENTIFIER_SUFFIX,
      permissions: [
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_BACKGROUND_LOCATION',
        'android.permission.FOREGROUND_SERVICE',
        'android.permission.FOREGROUND_SERVICE_LOCATION',
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
      ],
    },
    ios: {
      bundleIdentifier: 'com.comapeo' + IDENTIFIER_SUFFIX,
    },
    extra: {
      eas: {
        projectId: '2d5b8137-12ec-45aa-9c23-56b6a1c522b7',
      },
    },
    owner: 'digidem',
  };
};
