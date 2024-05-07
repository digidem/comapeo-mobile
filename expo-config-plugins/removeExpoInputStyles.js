const {withAndroidStyles, AndroidConfig} = require('expo/config-plugins');

/**
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
module.exports = function removeExpoInputStyles(config) {
  return withAndroidStyles(config, configWithAndroidStyles => {
    const stylesResourceXml = configWithAndroidStyles.modResults;

    // 1. Remove resource group that adds the input reset
    const resetEditTextStyle = AndroidConfig.Styles.getStyleParent(
      stylesResourceXml,
      {
        name: 'ResetEditText',
        parent: '@android:style/Widget.EditText',
      },
    );

    // AndroidConfig does not seem to provide a utility for removing a resource group
    stylesResourceXml.resources.style =
      stylesResourceXml.resources.style.filter(
        styleParent => styleParent !== resetEditTextStyle,
      );

    // 2. Remove any style items referencing the removed resource group
    for (const style of stylesResourceXml.resources.style) {
      AndroidConfig.Styles.removeStylesItem({
        name: 'android:editTextStyle',
        parent: style.$,
        xml: stylesResourceXml,
      });
    }

    return configWithAndroidStyles;
  });
};
