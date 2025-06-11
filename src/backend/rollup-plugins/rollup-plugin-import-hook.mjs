// @ts-check
import MagicString from 'magic-string'

/**
 * Rollup plugin replace path to import-in-the-middle hook.
 */
export default function nativePathsPlugin() {
  return {
    name: 'rollup-plugin-import-hook',

    /**
     * @param {string} code
     */
    transform(code) {
      if (!code.includes('import-in-the-middle')) return null

      const magicString = new MagicString(code)

      magicString.replaceAll(
        /register\(['"]import-in-the-middle\/hook.mjs['"]/g,
        "register('./importHook.js'",
      )

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
