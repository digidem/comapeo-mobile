// @ts-check
import {TypedEmitter} from 'tiny-typed-emitter';

import {DataTypeDriver} from './drivers.js';

/**
 * @typedef {{
 * lat: number
 * lon: number
 * tags?: { type: string }
 * }} Observation
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
