// Helper declaration
const API_PREFIX = '/api'
const leftPane = {
  content: [
    { component: 'account/KProfile', class: 'full-width' },
    { id: 'users', icon: 'las la-users', label: 'UsersActivity.LABEL', renderer: 'item', route: { name: 'users-activity' } },
    { id: 'organizations', icon: 'las la-sitemap', label: 'OrganizationsActivity.LABEL', renderer: 'item', route: { name: 'organizations-activity' } },
    { id: 'logout', icon: 'las la-sign-out-alt', label: 'LOGOUT', renderer: 'item', route: { name: 'logout' } }
  ],
  opener: true,
  visible: false
}

module.exports = {
  appName: 'Kalisio Teams',
  buildMode: process.env.BUILD_MODE === 'pwa' ? 'pwa' : 'spa',
  appLogo: 'teams-logo.png',  
  flavor: process.env.NODE_APP_INSTANCE || 'dev',
  version: require('../package.json').version,
  buildNumber: process.env.BUILD_NUMBER,
  apiPath: API_PREFIX,
  terms: 'teams-terms',
  apiJwt: 'teams-jwt',
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
  screens: {
    actions: [{ 
      id: 'terms-policies', 
      label: 'screen.TERMS_AND_POLICIES', 
      dialog: {
        component: 'document/KDocument',
        url: 'teams-terms.md'
      }
    }],
    logout: {
      actions: [
        { id: 'login-link', label: 'KLogoutScreen.LOG_IN_AGAIN_LABEL', route: { name: 'login' } }
      ]
    }
  },
  usersActivity: {
    panes: {
      left: leftPane
    },
    items: {
      actions: [
        { id: 'view-user', icon: 'las la-eyes' }
      ]
    }
  },
  organizationsActivity: {
    panes: {
      left: leftPane
    }
  },
  routes: require('../src/router/routes')
}
