export class ExhaustivenessError extends Error {
  constructor(value: never) {
    super(`Exhaustiveness check failed. ${value} should be impossible`);
    this.name = 'ExhaustivenessError';
  }
}
