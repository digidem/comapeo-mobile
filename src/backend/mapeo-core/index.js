// @ts-check
import {TypedEmitter} from 'tiny-typed-emitter';

import {DataTypeDriver} from './drivers.js';

export class MapeoClient extends TypedEmitter {
  /** @type {DataTypeDriver<import("@mapeo/schema").Observation>} */
  #observation;
  /** @type {DataTypeDriver<import("@mapeo/schema").Preset>} */
  #preset;

  constructor() {
    super();

    this.#observation = new DataTypeDriver('observation');
    this.#preset = new DataTypeDriver('preset');
  }

  get observation() {
    return this.#observation;
  }

  get preset() {
    return this.#preset;
  }
}
