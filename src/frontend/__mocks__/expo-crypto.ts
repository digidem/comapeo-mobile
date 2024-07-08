import {createHash, type BinaryToTextEncoding} from 'node:crypto';

export enum CryptoDigestAlgorithm {
  SHA512 = 'sha512',
}

export enum CryptoEncoding {
  HEX = 'hex',
  BASE64 = 'base64',
}

type CryptoDigestOptions = {
  encoding: CryptoEncoding;
};

/**
 * Ponyfill of `crypto.hash` for old environments.
 *
 * [0]: https://nodejs.org/api/crypto.html#cryptohashalgorithm-data-outputencoding
 */
const hash = (
  algorithm: string,
  data: string | Uint8Array,
  outputEncoding: BinaryToTextEncoding,
): string => createHash(algorithm).update(data).digest(outputEncoding);

export const digestStringAsync = (
  algorithm: CryptoDigestAlgorithm,
  data: string,
  options: CryptoDigestOptions = {encoding: CryptoEncoding.HEX},
): Promise<string> => Promise.resolve(hash(algorithm, data, options.encoding));
