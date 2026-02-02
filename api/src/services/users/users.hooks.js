import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import { hooks as kdkCoreHooks } from '@kalisio/kdk/core.api.js'
import { Roles } from '../../../../common/permissions.mjs'

// Used to retrieve keycloak roles and convert into permissions system
const serializeRoles = kdkCoreHooks.serialize([
  { source: 'keycloak.roles', target: 'permissions', filter: { $in: _.keys(Roles) } }
])

const { iff, isProvider, disallow } = commonHooks

export default {
  before: {
    all: [],
    find: [iff(isProvider('external'), kdkCoreHooks.onlyMe())],
    get: [iff(kdkCoreHooks.isNotMe(), disallow('external'))],
    create: [disallow('external'), serializeRoles],
    update: [disallow('external'), serializeRoles],
    patch: [disallow('external'), serializeRoles],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
