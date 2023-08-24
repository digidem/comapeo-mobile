// @ts-check
import {TypedEmitter} from 'tiny-typed-emitter';

import {DataTypeDriver} from './drivers.js';

/**
 * @typedef {Object} Observation
 */

export class MapeoClient extends TypedEmitter {
  /** @type {DataTypeDriver<Observation>} */
  #observation;

  constructor() {
    super();

    this.#observation = new DataTypeDriver('observation');
  }

  get observation() {
    return this.#observation;
  }
}
