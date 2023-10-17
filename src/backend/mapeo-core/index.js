// @ts-check
import {TypedEmitter} from 'tiny-typed-emitter';

import {ObservationDriver, PresetDriver, FieldDriver} from './drivers.js';

export class MapeoClient extends TypedEmitter {
  /** @type {ObservationDriver} */
  #observation;
  /** @type {PresetDriver} */
  #preset;
  /** @type {FieldDriver} */
  #field;

  constructor() {
    super();

    this.#observation = new ObservationDriver();
    this.#preset = new PresetDriver();
    this.#field = new FieldDriver();
  }

  get observation() {
    return this.#observation;
  }

  get preset() {
    return this.#preset;
  }

  get field() {
    return this.#field;
  }
}
