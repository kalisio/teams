const tours = require('../tours')

module.exports = [{
  path: '/:token?',
  name: 'index',
  component: 'Index',
  meta: { unauthenticated: true },
  children: {
    login: {
      component: 'screen/KOAuthLoginScreen'
    },
    logout: {
      component: 'screen/KLogoutScreen',
      meta: { authenticated: true }
    },
    home: {  
      component: 'app/KHome',
      meta: { authenticated: true, unauthenticated: false },
      children: {
        'default-home-view': {
          path: '',
          name: 'home',
          redirect: { name: 'organisations-activity' }
        },
        organisations: {
          name: 'organisations-activity',
          component: 'organisationsActivity'
        },
        users: {
          name: 'users-activity',
          component: 'UsersActivity'
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
