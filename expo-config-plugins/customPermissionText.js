const {withStringsXml} = require('@expo/config-plugins');

module.exports = function customPermissionText(config) {
  return withStringsXml(config, config => {
    config.modResults = addOrReplacePermissions(config.modResults);
    return config;
  });
};

function addOrReplacePermissions(stringsXml) {
  const strings = stringsXml.resources.string ?? [];

  const set = (name, value) => {
    const existing = strings.find(s => s.$?.name === name);
    if (existing) {
      existing._ = value;
    } else {
      strings.push({$: {name}, _: value});
    }
  };

  set('permission_camera_description', 'Allow CoMapeo to use the camera?');
  set(
    'permission_access_fine_location_description',
    'Allow CoMapeo to use location?',
  );

  stringsXml.resources.string = strings;
  return stringsXml;
}
