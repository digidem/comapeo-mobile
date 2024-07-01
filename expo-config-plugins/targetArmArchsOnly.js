const {
  withAppBuildGradle,
  withGradleProperties,
} = require('expo/config-plugins');
const {
  mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');

/**
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
module.exports = function targetArmArchsOnly(config) {
  // Update reactNativeArchitectures property in android/gradle.properties
  const conf = withGradleProperties(config, configWithGradleProperties => {
    const reactNativeArchitecturesProperty =
      configWithGradleProperties.modResults.find(
        p => p.type === 'property' && p.key === 'reactNativeArchitectures',
      );

    if (!reactNativeArchitecturesProperty) {
      throw new Error(
        "Could not find existing 'reactNativeArchitectures' property in android/gradle.properties",
      );
    }

    reactNativeArchitecturesProperty.value = 'armeabi-v7a,arm64-v8a';

    return configWithGradleProperties;
  });

  // Update android.defaultConfig in android/app/build.gradle
  return withAppBuildGradle(conf, configWithAppBuildGradle => {
    const abiFilters = `\t\tndk {\n\t\t\tabiFilters "armeabi-v7a", "arm64-v8a"\n\t\t}`;

    configWithAppBuildGradle.modResults.contents = mergeContents({
      tag: 'comapeo:add-ndk-abi-filters',
      src: configWithAppBuildGradle.modResults.contents,
      newSrc: abiFilters,
      anchor: /defaultConfig {/gm,
      offset: 1,
      comment: '//',
    }).contents;

    return configWithAppBuildGradle;
  });
};

/**
 */
