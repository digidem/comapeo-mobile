import {ExhaustivenessError} from './ExhaustivenessError';

describe('ExhaustivenessError', () => {
  const bools = [true, false];

  expect(() => {
    bools.forEach(bool => {
      switch (bool) {
        case true:
        case false:
          break;
        default:
          throw new ExhaustivenessError(bool);
      }
    });
  }).not.toThrow();
});
