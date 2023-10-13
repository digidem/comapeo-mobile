// @ts-check
import {TypedEmitter} from 'tiny-typed-emitter';

import {ManagerDriver} from './drivers.js';

export class MapeoClient extends TypedEmitter {
  /** @type {ManagerDriver} */
  manager;

  constructor() {
    super();

    this.manager = new ManagerDriver();
  }
}
