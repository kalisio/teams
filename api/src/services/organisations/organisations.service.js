import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import makeDebug from 'debug'
//import { createStorageService, removeStorageService } from '@kalisio/kdk/core.api.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const debug = makeDebug('teams:organisations:service')

export default async function (name, app, options) {
  debug('organisations created')
  //const config = app.get('storage')
  //console.log(config)
  //debug('S3 team storage client created with config ', config)

  return 
}
/*
    // Hooks that can be added to customize organization services
    organisationServicesHooks: [],

    registerOrganisationServicesHook (hook) {
      if (!this.organisationServicesHooks.includes(hook)) {
        this.organisationServicesHooks.push(hook)
      }
    },

    unregisterOrganisationServicesHook (hook) {
      this.organisationServicesHooks = this.organisationServicesHooks.filter(registeredHook => registeredHook !== hook)
    },

    async createOrganisationServices (organisation, db) {
      await this.app.createService('members', {
        servicesPath,
        context: organisation,
        proxy: {
          service: this.app.getService('users'),
          params: { query: { 'organisations._id': organisation._id } }
        }
      })
      debug('Members service created for organisation ' + organisation.name)
      await this.app.createService('groups', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Groups service created for organisation ' + organisation.name)
      await createStorageService.call(this.app, { context: organisation })
      debug('Storage service created for organisation ' + organisation.name)
      // Run registered hooks
      for (let i = 0; i < this.organisationServicesHooks.length; i++) {
        const hook = this.organisationServicesHooks[i]
        await hook.createOrganisationServices.call(this.app, organisation, db)
      }
    },

    async removeOrganisationServices (organisation) {
      // Run registered hooks (reverse order with respect to creation)
      for (let i = this.organisationServicesHooks.length - 1; i >= 0; i--) {
        const hook = this.organisationServicesHooks[i]
        await hook.removeOrganisationServices.call(this.app, organisation)
      }
      await removeStorageService.call(this.app, { context: organisation })
      debug('Storage service removed for organisation ' + organisation.name)
      await this.app.removeService(app.getService('groups', organisation))
      debug('Groups service removed for organisation ' + organisation.name)
      await this.app.removeService(app.getService('members', organisation))
      debug('Members service removed for organisation ' + organisation.name)
    },

    async configureOrganisations () {
      // Reinstanciate services for all organisations
      const organisations = await this.find({ paginate: false })
      organisations.forEach(organisation => {
        debug('Configuring organisation ' + organisation.name)
        // Get org DB
        const db = this.app.db.client.db(organisation._id.toString())
        this.createOrganisationServices(organisation, db)
      })
    }
  }
}*/
