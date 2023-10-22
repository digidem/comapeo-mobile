// @ts-check
import MagicString from 'magic-string';
import path from 'path';

/**
 *
 * @param {object} [opts]
 * @param {string} [opts.relativePath=node_modules]
 * @returns
 */
export default function nativePathsPlugin({
  relativePath = 'node_modules',
} = {}) {
  /**
   * @type {Array<{ pattern: RegExp, replacement: (packageName: string) => string }>}
   */
  const replacements = [
    {
      // node-bindings as used by better-sqlite3
      pattern: /require\(['"]bindings['"]\)\(((['"]).+?\2)?\)/g,
      replacement: packageName =>
        `require('bindings')({ module_root: cjsPath.join(__dirname, '${relativePath}', '${packageName}'), bindings: $1 })`,
    },
    {
      pattern: /require\(['"]node-gyp-build['"]\)\(__dirname\)/g,
      replacement: packageName =>
        `require('node-gyp-build')(cjsPath.join(__dirname, '${relativePath}', '${packageName}'))`,
    },
  ];

  return {
    name: 'rollup-plugin-natives',

    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code, id) {
      const magicString = new MagicString(code);
      const packageName = getPackageName(id);

      if (!packageName) {
        return null;
      }

      for (const {pattern, replacement} of replacements) {
        magicString.replaceAll(pattern, replacement(packageName));
      }

      if (!magicString.hasChanged()) {
        return null;
      }

      const result = {
        code: magicString.toString(),
        map: magicString.generateMap({hires: true}),
      };
      return result;
    },
  };
}

// Vendored from https://github.com/i-like-robots/get-package-name/blob/d9f819b/index.js

/**
 * @param {string} modulePath Path to a module file
 * @param {string} [packageFolder="node_modules"] The dependency folder name
 * @return {string | undefined} The package name if it is found or undefined
 */
function getPackageName(modulePath, packageFolder = 'node_modules') {
  if (typeof modulePath === 'string' && modulePath.includes(packageFolder)) {
    const segments = modulePath.split(path.sep);
    const index = segments.lastIndexOf(packageFolder);

    if (index > -1) {
      const name = segments[index + 1] || '';
      const scopedName = segments[index + 2] || '';

      if (name[0] === '@') {
        return scopedName ? `${name}/${scopedName}` : undefined;
      }

      if (name) {
        return name;
      }
    }
  }
}
