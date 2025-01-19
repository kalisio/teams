import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import kdkCore, { createDatabasesService } from '@kalisio/kdk/core.api.js'
import { Service as KeycloakListenerService, hooks as keycloakListenerHooks } from '@kalisio/feathers-keycloak-listener/lib/index.js'

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
  } catch (error) {
    app.logger.error(error.message)
  }

  // Create services to manage MongoDB databases, organisations, etc.
  await createDatabasesService.call(app)
  const organisationsService = await app.createService('organisations', { modelsPath, servicesPath })
  // Ensure permissions are correctly distributed when replicated
  const usersService = app.getService('users')
  const authorisationsService = app.getService('authorisations')
  usersService.on('patched', user => {
    // Patching profile should not trigger abilities update since
    // it is a perspective and permissions are not available in this case
    // Updating abilities in this case will result in loosing permissions for orgs/groups as none are available
    if (_.has(user, 'organisations') || _.has(user, 'groups')) authorisationsService.updateAbilities(user)
  })
  // Ensure org services are correctly distributed when replicated
  organisationsService.on('created', organisation => {
    // Check if already done (initiator)
    const orgMembersService = app.getService('members', organisation)
    if (!orgMembersService) {
      // Jump from infos/stats to real DB object
      const db = app.db.client.db(organisation._id.toString())
      organisationsService.createOrganisationServices(organisation, db)
    }
  })
  organisationsService.on('removed', organisation => {
    // Check if already done (initiator)
    const orgMembersService = app.getService('members', organisation)
    if (!orgMembersService) return
    organisationsService.removeOrganisationServices(organisation)
  })

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

  // Create the default user
  const defaultUsers = app.get('authentication').defaultUsers
  // Do not use exposed passwords on staging/prod environments
  if (defaultUsers && !process.env.NODE_APP_INSTANCE) {
    // Create default users if not already done
    const users = await usersService.find({ paginate: false })
    for (let i = 0; i < defaultUsers.length; i++) {
      const defaultUser = defaultUsers[i]
      const createdUser = _.find(users, user => user.email === defaultUser.email)
      if (!createdUser) {
        app.logger.info('Initializing default user (email = ' + defaultUser.email + ', password = ' + defaultUser.password + ')')
        await usersService.create(defaultUser)
      }
    }
  }
}
