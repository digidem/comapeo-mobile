const {withAndroidStyles} = require('expo/config-plugins');

function withCustomAppTheme(config, customAppTheme) {
  return withAndroidStyles(config, config => {
    const styles = config.modResults;
    styles.resources.style.map(style => {
      if (style.$?.name === 'ResetEditText') {
        styles.resources.style.splice(styles.resources.style.indexOf(style), 1);
      }
      for (let i = 0; i < style.item.length; i++) {
        if (
          style.item[i]._ === '@style/ResetEditText' &&
          style.item[i].$.name === 'android:editTextStyle'
        ) {
          style.item.splice(i, 1);

          i--;
        }
      }
    });
    return config;
  });
}
module.exports = withCustomAppTheme;
