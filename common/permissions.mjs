import _ from 'lodash'

export const Roles = {
  superadmin: 0
}

// Hook to manage app permissions
export function defineUserAbilities (subject, can, cannot, app) {
  if (subject && subject._id) {
    if (subject.permissions) {
      const roles = (Array.isArray(subject.permissions) ? subject.permissions : [subject.permissions])
      roles.forEach(role => {
        // Process app-related roles only
        if (!_.has(Roles, role)) return
        // Map from name to ID
        role = Roles[role]
        // Full access to superadmin
        if (role >= Roles.superadmin) {
          can('manage', 'all')
        }
      })
    }
  }
}
