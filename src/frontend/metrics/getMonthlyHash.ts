import {CryptoDigestAlgorithm, digestStringAsync} from 'expo-crypto';

export const getMonthlyHash = (
  salt: string,
  metricsDeviceId: string,
  now: Date,
): Promise<string> =>
  digestStringAsync(
    CryptoDigestAlgorithm.SHA512,
    `${now.getUTCFullYear()}-${now.getUTCMonth()}-${metricsDeviceId}-${salt}`,
  );
