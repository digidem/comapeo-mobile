// @ts-check
import MagicString from 'magic-string'
import path from 'path'

/**
 * Rollup plugin to fix bindings & node-gyp-build paths in native modules.
 *
 * By default all copies of a module are pointed at the hoisted
 * `node_modules/<name>` path. For modules in `preserveNestingFor`, nested
 * copies keep their nested path: the tree can legitimately contain the same
 * native module at multiple incompatible versions (e.g. sodium-native 4.x
 * hoisted for the fallback old core and 5.x nested under the hypercore 11
 * packages), and each copy must load its own matching prebuild.
 *
 * @param {object} [opts]
 * @param {string[]} [opts.preserveNestingFor=[]]
 */
export default function nativePathsPlugin({preserveNestingFor = []} = {}) {
  /**
   * @type {Array<{ pattern: RegExp, replacement: (packageDir: string, filename: string) => string }>}
   */
  const replacements = [
    {
      // node-bindings as used by better-sqlite3
      pattern: /require\(['"]bindings['"]\)\(((['"]).+?\2)?\)/g,
      replacement: (packageDir) =>
        `require('bindings')({ module_root: cjsPath.join(__dirname, '${packageDir}'), bindings: $1 })`,
    },
    {
      pattern: /require\(['"]node-gyp-build['"]\)\(__dirname\)/g,
      replacement: (packageDir) =>
        `require('node-gyp-build')(cjsPath.join(__dirname, '${packageDir}'))`,
    },
    {
      pattern: /require\.addon\(['"]\.['"],\s+__filename\)/g,
      replacement: (packageDir, filename) =>
        // NB: This is fragile, it depends on the original package calling this from a file in the package root
        `require.addon('.', cjsPath.join(__dirname, '${packageDir}', '${filename}'))`,
    },
  ]

  return {
    name: 'rollup-plugin-natives',

    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code, id) {
      const magicString = new MagicString(code)
      const nestedDir = getPackageDir(id)
      const filename = path.basename(id)

      if (!nestedDir) {
        return null
      }

      const packageName = nestedDir.slice(nestedDir.lastIndexOf('node_modules') + 'node_modules/'.length)
      const packageDir = preserveNestingFor.includes(packageName)
        ? nestedDir
        : `node_modules/${packageName}`

      for (const { pattern, replacement } of replacements) {
        magicString.replaceAll(pattern, replacement(packageDir, filename))
      }

      if (!magicString.hasChanged()) {
        return null
      }

      const result = {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true }),
      }
      return result
    },
  }
}

/**
 * Get a module's package directory relative to the project root, keeping any
 * node_modules nesting, e.g.
 * `.../node_modules/@comapeo/core/node_modules/sodium-native/binding.js` →
 * `node_modules/@comapeo/core/node_modules/sodium-native`
 *
 * @param {string} modulePath Path to a module file
 * @param {string} [packageFolder="node_modules"] The dependency folder name
 * @return {string | undefined} The package directory if it is found or undefined
 */
function getPackageDir(modulePath, packageFolder = 'node_modules') {
  if (typeof modulePath !== 'string' || !modulePath.includes(packageFolder)) {
    return undefined
  }

  const segments = modulePath.split(path.sep)
  const first = segments.indexOf(packageFolder)
  const last = segments.lastIndexOf(packageFolder)
  if (first === -1 || last === -1) return undefined

  const name = segments[last + 1] || ''
  if (!name) return undefined
  if (name[0] === '@' && !segments[last + 2]) return undefined

  const end = name[0] === '@' ? last + 2 : last + 1
  return segments.slice(first, end + 1).join('/')
}
