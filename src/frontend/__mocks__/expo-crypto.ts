import {createHash} from 'node:crypto';
import {type BufferSource} from 'node:stream/web';

export enum CryptoDigestAlgorithm {
  SHA512 = 'sha512',
}

export function digest(
  algorithm: CryptoDigestAlgorithm,
  data: BufferSource,
): Promise<ArrayBuffer> {
  const hash = createHash(algorithm);

  const dataToHash = new Uint8Array(
    data instanceof ArrayBuffer ? data : data.buffer,
  );
  hash.update(dataToHash);

  const result = hash.digest().buffer;

  return Promise.resolve(result);
}
