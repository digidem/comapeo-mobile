/**
 * Shim for @node-rs/crc32 written in pure JavaScript.
 *
 * Modified from [this sample implementation](https://www.w3.org/TR/2022/WD-png-3-20221025/#D-CRCAppendix).
 *
 * @module
 */

/* eslint-disable no-bitwise */

/** @type {undefined | Uint32Array} */
let crcTable

/**
 * @param {string | Buffer} input
 * @param {number | undefined | null} [initialState]
 * @returns {number}
 */
function crc32(input, initialState) {
  if (typeof input === 'string') return crc32(Buffer.from(input), initialState)

  if (!crcTable) {
    crcTable = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let b = i
      for (let j = 0; j < 8; j++) {
        b = b & 1 ? 0xedb88320 ^ (b >>> 1) : b >>> 1
      }
      crcTable[i] = b >>> 0
    }
  }

  let crc = ~~(initialState || 0) ^ -1
  for (let i = 0; i < input.length; i++) {
    crc = crcTable[(crc ^ input[i]) & 0xff] ^ (crc >>> 8)
  }
  crc ^= -1

  return crc >>> 0
}

exports.crc32 = crc32
