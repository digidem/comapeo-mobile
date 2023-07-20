// @ts-check
/**
 * @typedef {Record<string, *>} MapeoType
 */

/**
 * @template {MapeoType} V
 * @typedef {Object} MapeoDoc
 *
 * @property {string} id
 * @property {string} version
 * @property {boolean} deleted
 * @property {string[]} links
 * @property {string[]} forks
 * @property {number} created_at
 * @property {number?} updated_at
 * @property {V} value
 */

/** @typedef {'lan' | 'internet'} ConnectionType */

/**
 * @typedef {Object} SyncInfo
 *
 * @property {ConnectionType[]} discovery
 * @property {ConnectionType[]} sync
 */

/**
 * @typedef {Object} Peer
 *
 * @property {string} id
 * @property {string?} name
 * @property {number} lastSynced
 * @property {number} lastSeen
 *
 */

/**
 * @typedef {Object} SyncExchangeInfo
 *
 * @property {number} has
 * @property {number} wants
 *
 */

/**
 * @typedef {Object} SyncState
 *
 * @property {string} id
 * @property {SyncExchangeInfo} db
 * @property {SyncExchangeInfo} media
 * @property {{timestamp: string, db: SyncExchangeInfo, media: SyncExchangeInfo}} atSyncStart
 * @property {string} lastCompletedAt
 * @property {{timestamp: string, error: string}?} syncError
 * @property {{timestamp: string, error: string}?} connectionError
 */

/**
 * @typedef {Object} Project
 *
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {'creator' | 'coordinator' | 'member'} ProjectRole
 */

/**
 * @typedef {Object} ProjectMember
 *
 * @property {string} id
 * @property {string?} name
 * @property {ProjectRole} role
 */

/**
 * @template {MapeoType} T
 *
 * @extends DataTypeDriver<T>
 */
export class DataTypeDriver {
  /** @type {MapeoDoc<T>[]} */
  _db = []

  /**
   *
   * @param {string} name
   */
  constructor(name) {
    this._name = name
  }

  /**
   * @param {MapeoDoc<T>['value']} value
   *
   * @returns {MapeoDoc<T>}
   */
  create(value) {
    const now = Date.now()

    const doc = {
      id: now.toString(),
      version: `${now}@1`,
      created_at: now,
      updated_at: null,
      deleted: false,
      value,
      forks: [],
      links: [],
    }

    this._db.push(doc)

    return doc
  }

  /**
   *
   * @param {string} id
   *
   * @returns {MapeoDoc<T>}
   */
  getByDocId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i]

      if (doc && doc.id === id) {
        return doc
      }
    }

    throw new Error('Could not find')
  }

  /**
   * @param {string} id
   *
   * @returns {MapeoDoc<T>}
   */
  getByVersionId(id) {
    for (let i = this._db.length; i > -1; i--) {
      const doc = this._db[i]

      if (doc && doc.version === id) {
        return doc
      }
    }

    throw new Error('Could not find')
  }

  /**
   * @param {{includeDeleted: boolean | undefined}} [opts]
   *
   * @returns {MapeoDoc<T>[]}
   */
  getMany(opts) {
    return opts && opts.includeDeleted
      ? this._db
      : this._db.filter((d) => !d.deleted)
  }

  /**
   * @param {string | string[]} version
   * @param {Partial<MapeoDoc<T>['value']>} value
   *
   * @returns {MapeoDoc<T>}
   */
  update(version, value) {
    if (Array.isArray(version))
      throw new Error('Version array not supported yet')

    const doc = this.getByVersionId(version)

    if (doc.deleted) throw new Error('Cannot update deleted doc')

    const [id, prevVersionNumber] = doc.version.split('@')

    const nextVersion = `${id}@${parseInt(prevVersionNumber, 10) + 1}`

    const updated = {
      ...doc,
      version: nextVersion,
      links: [...doc.links, doc.version],
      updated_at: Date.now(),
      value: { ...doc.value, ...value },
    }

    this._db.push(updated)

    return updated
  }

  /**
   * @param {string | string[]} version
   *
   * @returns {MapeoDoc<T>}
   */
  delete(version) {
    if (Array.isArray(version))
      throw new Error('Version array not supported yet')

    const doc = this.getByVersionId(version)

    const updated = {
      ...doc,
      deleted: true,
      links: [...doc.links, doc.version],
      updated_at: Date.now(),
    }

    this._db.push(updated)

    return updated
  }
}

export class SyncDriver {
  /** @type {Set<ConnectionType>} */
  _discovery = new Set()

  /** @type {Set<ConnectionType>} */
  _sync = new Set()

  /**
   * @returns {SyncInfo}
   */
  info() {
    return {
      discovery: Array.from(this._discovery.values()),
      sync: Array.from(this._sync.values()),
    }
  }

  /**
   * @param {ConnectionType[] | null} connectionTypes
   */
  setDiscovery(connectionTypes) {
    const ct = connectionTypes || []

    this._discovery.clear()

    for (const val of ct) {
      this._discovery.add(val)
    }
  }

  /**
   * @param {ConnectionType[] | null} connectionTypes
   */
  setSync(connectionTypes) {
    const ct = connectionTypes || []

    this._sync.clear()

    for (const val of ct) {
      this._sync.add(val)
    }
  }
}

export class PeerDriver {
  /** @type {Map<string, Peer>} */
  _peers = new Map()

  /**
   * @param {string} id
   * @returns {Peer | null}
   */
  get(id) {
    return this._peers.get(id) || null
  }

  /**
   * @returns {Peer[]}
   */
  getAll() {
    return Array.from(this._peers.values())
  }
}

export class ProjectDriver {
  /** @type {Map<string, ProjectMember>} */
  _members = new Map()

  /** @type {Map<string, {id: string, role: ProjectRole}>} */
  _invites = new Map()

  /**
   * @param {string} name
   */
  constructor(name) {
    this._id = Date.now().toString()
    this._name = name
  }

  get member() {
    const self = this

    /**
     * @param {string} id
     * @returns {Promise<ProjectMember | null>}
     */
    return {
      /**
       * @param {string} id
       *
       * @return {ProjectMember | null}
       */
      get(id) {
        const member = self._members.get(id)

        return member || null
      },

      /**
       * @param {*} opts
       * @returns {ProjectMember[]}
       */
      getMany(opts) {
        return Array.from(self._members.values())
      },

      /**
       * @param {string} id
       * @param {{name:  string?, role: ProjectRole}} info
       *
       * @returns {ProjectMember}
       */
      add(id, info) {
        if (self._members.has(id)) throw new Error('Already exists')
        const member = { ...info, id }
        self._members.set(id, member)
        return member
      },
      /**
       * @param {string} id
       */
      remove(id) {
        if (!self._members.has(id)) throw new Error('Does not exist')
        self._members.delete(id)
      },

      /**
       * @param {string} id
       * @param {{name?:  string | null, role?: ProjectRole}} info
       *
       * @returns {ProjectMember}
       */
      update(id, info) {
        if (info.name === undefined && info.role === undefined)
          throw new Error('Must provide name or role to update')

        const member = self._members.get(id)

        if (!member) throw new Error('Does not exist')

        if (info.name !== undefined) {
          member.name = info.name
        }

        if (info.role) {
          member.role = info.role
        }

        return member
      },
    }
  }

  get invite() {
    const self = this

    return {
      /**
       * @param {string} id
       * @param {ProjectRole} role
       */
      create(id, role) {
        if (!self._invites.has(id)) {
          self._invites.set(id, { id, role })
        }
      },

      /**
       * @param {*} opts
       * @returns {{id: string, role: ProjectRole}[]}
       */
      getMany(opts) {
        return Array.from(self._invites.values())
      },
    }
  }

  /**
   * @returns {Project}
   */
  info() {
    return { id: this._id, name: this._name }
  }

  /**
   * @param {{ name: string }} info
   * @returns {Project}
   */
  update(info) {
    this._name = info.name
    return this.info()
  }
}

export class ProjectsManagementDriver {
  _id = Date.now().toString()

  /** @type {Map<string, ProjectDriver>} */
  _projects = new Map()

  /**
   * @param {ProjectDriver} [initProjectDriver]
   */
  constructor(initProjectDriver) {
    if (initProjectDriver)
      this._projects.set(initProjectDriver.info().id, initProjectDriver)
  }

  /**
   * @param {string} id
   *
   * @returns {Project | null}
   */
  get(id) {
    const project = this._projects.get(id)

    if (!project) return null

    return project.info()
  }

  /**
   * @param {*} opts
   *
   * @returns {Project[]}
   */
  getMany(opts) {
    return Array.from(this._projects.values()).map((p) => p.info())
  }

  /**
   * @param {{ name: string }} opts
   *
   * @returns {Project}
   */
  create(opts) {
    const project = new ProjectDriver(opts.name)

    const info = project.info()

    this._projects.set(info.id, project)

    return info
  }

  /**
   * @param {string} id
   * @param {{ name: string }} info
   *
   * @returns {Project}
   */
  update(id, info) {
    const project = this._projects.get(id)

    if (!project) throw new Error('Not found')

    return project.update(info)
  }

  /**
   * @param {string} id
   *
   * @returns {Project}
   */
  delete(id) {
    const project = this._projects.get(id)

    if (!project) throw new Error('Not found')

    this._projects.delete(id)

    return project.info()
  }

  get invite() {
    const self = this

    return {
      /**
       * @param {string} id
       * @param {*} params
       */
      accept(id, params) {},

      /**
       * @param {string} id
       * @param {*} params
       */
      async decline(id, params) {},
    }
  }
}
