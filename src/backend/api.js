export const api = {
  /** @param {String} who */
  greet: who => `hi ${who} from rpc-reflector`,
  /** @param {String} who */
  asyncGreet: who =>
    new Promise(res => {
      setTimeout(() => {
        res(`hi ${who} from async rpc-reflector`);
      }, 1000);
    }),
};

export default api;

