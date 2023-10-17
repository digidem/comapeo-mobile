export class ObservationDriver {
  /** @type {import("@mapeo/schema").Observation[]} */
  _db = [];

  constructor() {}

  /**
   * @param {import("@mapeo/schema").ObservationValue} value
   *
   * @returns {import("@mapeo/schema").Observation}
   */
  create(value) {
    const now = Date.now();

    /**
     * @type {import("@mapeo/schema").Observation}
     */
    const observation = {
      docId: now.toString(),
      versionId: `${now}@1`,
      createdAt: now.toString(),
      updatedAt: now.toString(),
      links: [],
      createdBy: '',
      deleted: false,
      ...value,
    };

    this._db.push(observation);

    return observation;
  }

  /**
   *
   * @param {string} id
   *
   * @returns {import("@mapeo/schema").Observation}
   */
  getByDocId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i];

      if (doc && doc.docId === id) {
        return doc;
      }
    }

    throw new Error('Could not find');
  }

  /**
   * @param {string} id
   *
   * @returns {import("@mapeo/schema").Observation}
   */
  getByVersionId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i];

      if (doc && doc.versionId === id) {
        return doc;
      }
    }

    throw new Error('Could not find');
  }

  /**
   * @param {{includeDeleted: boolean | undefined}} [opts]
   *
   * @returns {import("@mapeo/schema").Observation[]}
   */
  getMany(opts) {
    return this._db;
  }

  /**
   * @param {string | string[]} version
   * @param {Partial<import("@mapeo/schema").Observation>} value
   *
   * @returns {import("@mapeo/schema").Observation}
   */
  update(version, value) {
    if (Array.isArray(version)) {
      throw new Error('Version array not supported yet');
    }

    const doc = this.getByVersionId(version);

    const [id, prevVersionNumber] = doc.versionId.split('@');

    const nextVersion = `${id}@${parseInt(prevVersionNumber, 10) + 1}`;

    const updated = {
      ...doc,
      version: nextVersion,
      links: [...doc.links, doc.versionId],
      updated_at: Date.now(),
      value: {...doc, ...value},
    };

    this._db.push(updated);

    return updated;
  }
}

export class PresetDriver {
  /** @type {import("@mapeo/schema").Preset[]} */
  _db = [];

  constructor() {}

  /**
   * @param {import("@mapeo/schema").PresetValue} value
   *
   * @returns {import("@mapeo/schema").Preset}
   */
  create(value) {
    const now = Date.now();

    /**
     * @type {import("@mapeo/schema").Preset}
     */
    const preset = {
      docId: now.toString(),
      versionId: `${now}@1`,
      createdAt: now.toString(),
      updatedAt: now.toString(),
      links: [],
      createdBy: '',
      deleted: false,
      ...value,
    };

    this._db.push(preset);

    return preset;
  }

  /**
   *
   * @param {string} id
   *
   * @returns {import("@mapeo/schema").Preset}
   */
  getByDocId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i];

      if (doc && doc.docId === id) {
        return doc;
      }
    }

    throw new Error('Could not find');
  }

  /**
   * @param {string} id
   *
   * @returns {import("@mapeo/schema").Preset}
   */
  getByVersionId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i];

      if (doc && doc.versionId === id) {
        return doc;
      }
    }

    throw new Error('Could not find');
  }

  /**
   * @returns {import("@mapeo/schema").Preset[]}
   */
  getMany() {
    return this._db;
  }

  /**
   * @param {string | string[]} version
   * @param {Partial<import("@mapeo/schema").Preset>} value
   *
   * @returns {import("@mapeo/schema").Preset}
   */
  update(version, value) {
    if (Array.isArray(version)) {
      throw new Error('Version array not supported yet');
    }

    const doc = this.getByVersionId(version);

    const [id, prevVersionNumber] = doc.versionId.split('@');

    const nextVersion = `${id}@${parseInt(prevVersionNumber, 10) + 1}`;

    const updated = {
      ...doc,
      version: nextVersion,
      links: [...doc.links, doc.versionId],
      updated_at: Date.now(),
      value: {...doc, ...value},
    };

    this._db.push(updated);

    return updated;
  }
}

export class FieldDriver {
  /** @type {import("@mapeo/schema").Field[]} */
  _db = [];

  constructor() {}

  /**
   * @param {import("@mapeo/schema").FieldValue & {docId:string}} value
   *
   * @returns {import("@mapeo/schema").Field}
   */
  create(value) {
    const now = Date.now();

    /**
     * @type {import("@mapeo/schema").Field }
     */
    const field = {
      versionId: `${now}@1`,
      createdAt: now.toString(),
      updatedAt: now.toString(),
      links: [],
      createdBy: '',
      deleted: false,
      ...value,
    };

    this._db.push(field);

    return field;
  }

  /**
   *
   * @param {string} id
   *
   * @returns {import("@mapeo/schema").Field}
   */
  getByDocId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i];

      if (doc && doc.docId === id) {
        return doc;
      }
    }

    throw new Error('Could not find');
  }

  /**
   * @param {string} id
   *
   * @returns {import("@mapeo/schema").Field}
   */
  getByVersionId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i];

      if (doc && doc.versionId === id) {
        return doc;
      }
    }

    throw new Error('Could not find');
  }

  /**
   * @param {{includeDeleted: boolean | undefined}} [opts]
   *
   * @returns {import("@mapeo/schema").Field[]}
   */
  getMany(opts) {
    return this._db;
  }

  /**
   * @param {string | string[]} version
   * @param {Partial<import("@mapeo/schema").Field>} value
   *
   * @returns {import("@mapeo/schema").Field}
   */
  update(version, value) {
    if (Array.isArray(version)) {
      throw new Error('Version array not supported yet');
    }

    const doc = this.getByVersionId(version);

    const [id, prevVersionNumber] = doc.versionId.split('@');

    const nextVersion = `${id}@${parseInt(prevVersionNumber, 10) + 1}`;

    const updated = {
      ...doc,
      version: nextVersion,
      links: [...doc.links, doc.versionId],
      updated_at: Date.now(),
      value: {...doc, ...value},
    };

    this._db.push(updated);

    return updated;
  }
}
