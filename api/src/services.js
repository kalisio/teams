import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import makeDebug from 'debug'
import kdkCore, { createDatabasesService, createDefaultTags } from '@kalisio/kdk/core.api.js'
import { Service as KeycloakListenerService, hooks as keycloakListenerHooks } from '@kalisio/feathers-keycloak-listener/lib/index.js'

const debug = makeDebug('teams:services')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelsPath = path.join(__dirname, 'models')
const servicesPath = path.join(__dirname, 'services')

export default async function () {
  const app = this

  // Set up our plugin services
  try {
    const packageInfo = fs.readJsonSync(path.join(__dirname, '../../package.json'))
    app.use(app.get('apiPath') + '/capabilities', (req, res, next) => {
      const response = {
        name: 'teams',
        domain: app.get('domain'),
        version: packageInfo.version
      }
      if (process.env.BUILD_NUMBER) {
        response.buildNumber = process.env.BUILD_NUMBER
      }
      res.json(response)
    })
    await app.configure(kdkCore)
    // Initialize KDK base services
    app.configureService('authentication', app.getService('authentication'), servicesPath)
    app.configureService('users', app.getService('users'), servicesPath)
    // Create the keycloak-event-listener service
    app.use(app.get('apiPath') + '/keycloak-events', new KeycloakListenerService({
      usersServicePath: app.get('apiPath') + '/users'
    })),
    app.getService('keycloak-events').hooks({
      after: {
        create: [
          keycloakListenerHooks.createUser,
          keycloakListenerHooks.updateUser,
          keycloakListenerHooks.deleteUser,
          keycloakListenerHooks.setSession,
          keycloakListenerHooks.unsetSession
        ]
      }
    })

    // Create app services
    await app.createService('groups', {
      modelsPath,
      servicesPath
    })

    // Initialize defaults
    await createDefaultTags.call(app)
  } catch (error) {
    app.logger.error(error.message)
  }
}
