// @ts-check
import {TypedEmitter} from 'tiny-typed-emitter';

import {ObservationDriver, PresetDriver} from './drivers.js';

export class MapeoClient extends TypedEmitter {
  /** @type {ObservationDriver} */
  #observation;
  /** @type {PresetDriver} */
  #preset;

  constructor() {
    super();

    this.#observation = new ObservationDriver();
    this.#preset = new PresetDriver();
  }

  get observation() {
    return this.#observation;
  }

  get preset() {
    return this.#preset;
  }
}
