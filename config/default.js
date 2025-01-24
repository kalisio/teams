// Helper declaration
const APP_SLUG='teams'
const API_PREFIX = '/api'
const LEFT_PANE = {
  content: [
    { component: 'account/KProfile', class: 'full-width' },
    { id: 'users', icon: 'las la-users', label: 'UsersActivity.LABEL', renderer: 'item', route: { name: 'users-activity' } },
    { id: 'organisations', icon: 'las la-sitemap', label: 'OrganisationsActivity.LABEL', renderer: 'item', route: { name: 'organizations-activity' } },
    { id: 'logout', icon: 'las la-sign-out-alt', label: 'LOGOUT', renderer: 'item', route: { name: 'logout' } }
  ],
  opener: true,
  visible: false
}

module.exports = {
  appName: 'Kalisio Teams',
  appSlug: APP_SLUG,
  buildMode: process.env.BUILD_MODE === 'pwa' ? 'pwa' : 'spa',
  flavor: process.env.NODE_APP_INSTANCE || 'dev',
  version: require('../package.json').version,
  buildNumber: process.env.BUILD_NUMBER,  
  apiPath: API_PREFIX,
  apiJwt: `${APP_SLUG}-jwt`,
  apiTimeout: 20000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  appChangelog: 'https://kalisio.github.io/teams/about/changelog.html',
  locale: {
    // If you'd like to force locale otherwise it is retrieved from browser
    // default: 'en',
    fallback: 'en'
  },
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  terms: 'teams-terms',
  screens: {
    actions: [{ 
      id: 'terms-policies', 
      label: 'screen.TERMS_AND_POLICIES', 
      dialog: {
        component: 'document/KDocument',
        url: 'teams-terms.md'
      }
    }],
    login: {
      actions: [
        { id: 'keycloak-link', label: 'screen.LOGIN_WITH_KEYCLOAK', renderer: 'form-button', route: { url: '/oauth/keycloak' } }
      ]
    },
    logout: {
      actions: [
        { id: 'login-link', label: 'KLogoutScreen.LOG_IN_AGAIN_LABEL', route: { name: 'login' } }
      ]
    }
  },
  organisationsActivity: {
    panes: {
      left: LEFT_PANE
    }
  },
  usersActivity: {
    panes: {
      left: LEFT_PANE
    },
    items: {
      actions: [
        { id: 'view-user', icon: 'las la-eyes' }
      ]
    }
  },
  routes: require('../src/router/routes')
}
