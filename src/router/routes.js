//const tours = require('../tours')

module.exports = [
  {
    path: '/:token?',
    name: 'index',
    component: 'Index',
    meta: { unauthenticated: true },
    children: {
      login: {
        component: 'screen/KOAuthLoginScreen'
      },
      'logout/:provider?': {
        name: 'logout',
        component: 'screen/KOAuthLogoutScreen',
        meta: { authenticated: true }
      },
      home: {
        component: 'app/KHome',
        meta: { authenticated: true, unauthenticated: false },
        children: {
          'default-home-view': {
            path: '',
            redirect: { name: 'users-activity' }
          },
          users: {
            name: 'users-activity',
            component: 'users/UsersActivity'
          }
        }
      }
    }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: 'screen/KErrorScreen'
  }
]
