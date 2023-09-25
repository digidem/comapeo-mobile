// @ts-check
import {TypedEmitter} from 'tiny-typed-emitter';

import {DataTypeDriver} from './drivers.js';

/**
 * @typedef {Object} Observation
 */

/**
 * @typedef {Object.<string, boolean | number | string | null | (boolean | number | string | null)[]>} Tag
 */

/**
 * Presets define how map entities are displayed to the user. They define the icon used on the map, and the fields / questions shown to the user when they create or edit the entity on the map. The `tags` property of a preset is used to match the preset with observations, nodes, ways and relations. If multiple presets match, the one that matches the most tags is used.
 * @typedef {Object} Preset
 * @property {string} name Name for the feature in default language.
 * @property {("point" | "vertex" | "line" | "area" | "relation")[]} geometry Valid geometry types for the feature - this preset will only match features of this geometry type `"point", "vertex", "line", "area", "relation"`
 * @property {Tag} tags The tags are used to match the preset to existing map entities. You can match based on multiple tags E.g. if you have existing points with the tags `nature:tree` and `species:oak` then you can add both these tags here in order to match only oak trees.
 * @property {Tag} addTags Tags that are added when changing to the preset (default is the same value as 'tags')
 * @property {Tag} removeTags Tags that are removed when changing to another preset (default is the same value as 'addTags' which in turn defaults to 'tags')
 * @property {string[]} fieldIds hex-encoded string. IDs of fields to displayed to the user when the preset is created or edited
 * @property {string} [iconId] hex-encoded string. ID of preset icon which represents this preset
 * @property {string[]} terms Synonyms or related terms (used for search)
 */

export class MapeoClient extends TypedEmitter {
  /** @type {DataTypeDriver<Observation>} */
  #observation;
  /** @type {DataTypeDriver<Preset>} */
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
