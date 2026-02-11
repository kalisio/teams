import _ from 'lodash'

export const Roles = {
  superadmin: 0
}

// Hook to manage app permissions
export function defineUserAbilities (subject, can, cannot, app) {
  if (subject && subject._id) {
    can('service', 'organisations')
    can('all', 'organisations')
    if (subject.permissions) {
      const roles = (Array.isArray(subject.permissions) ? subject.permissions : [subject.permissions])
      roles.forEach(role => {
        // Process app-related roles only
        if (!_.has(Roles, role)) return
        // Map from name to ID
        role = Roles[role]
        can('service', 'organisations')
        can('all', 'organisations')
        can('service', '*/groups')
        can('all', 'groups')
        can('service', '*/tags')
        can('all', 'tags')
        // Full access to superadmin
        if (role >= Roles.superadmin) {
          can('all', 'organisations')
          can('all', 'groups')
          can('all', 'tags')
        }
      })
    }
  }
}
