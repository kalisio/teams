var path = require('path')
var fs = require('fs')
var winston = require('winston')
const express = require('@feathersjs/express')
var containerized = require('containerized')()

const SERVER_PORT = process.env.PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const CLIENT_PORT = process.env.CLIENT_PORT || 8080
const API_PREFIX = '/api'

let host, domain
if (process.env.SUBDOMAIN) {
  host = 'teams.' + process.env.SUBDOMAIN
  domain = 'https://' + host
} else {
  // Otherwise we are on a developer machine
  host = 'localhost'
  domain = 'http://' + host
  if (process.env.NODE_ENV === 'development') {
    domain += ':' + CLIENT_PORT
  } else {
    domain += ':' + SERVER_PORT
  }
}

// Keycloak base url
const keycloakBaseUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/`

module.exports = {
  // Proxy your API if using any.
  // Also see /build/script.dev.js and search for "proxy api requests"
  // https://github.com/chimurai/http-proxy-middleware
  proxyTable: {},
  domain,
  host,
  port: SERVER_PORT,
  distPath: fs.existsSync(path.join(__dirname, '../../dist/pwa')) ? path.join(__dirname, '../../dist/pwa') : path.join(__dirname, '../../dist/spa'),
  apiPath: API_PREFIX,
  paginate: {
    default: 12,
    max: 50
  },
  distribution: {
    services: (service) => service.path.includes('organizations') || service.path.includes('groups'),
    remoteServices: (service) => false,
    middlewares: { after: express.errorHandler() },
    // When called internally from remote service do not authenticate,
    // this assumes a gateway scenario where authentication is performed externally
    authentication: false,
    key: 'teams',
    healthcheckPath: API_PREFIX + '/distribution/',
    distributedMethods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    distributedEvents: ['created', 'updated', 'patched', 'removed']
  },
  authentication: {
    secret: process.env.APP_SECRET,
    appId: process.env.APP_ID,
    path: API_PREFIX + '/authentication',
    service: API_PREFIX + '/users',
    // entityId: 'user',
    entity: 'user',
    authStrategies: [
      'jwt',
      'local'
    ],
    renewJwt: false,
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    jwtOptions: {
      header: {
        typ: 'access' // See https://tools.ietf.org/html/rfc7519#section-5.1
      },
      audience: process.env.SUBDOMAIN || 'kalisio', // The resource server where the token is processed
      issuer: 'kalisio', // The issuing server, application or resource
      algorithm: 'HS256', // See https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
      expiresIn: '1d'
    },
    oauth: {
      redirect: domain,
      defaults: {
        origin: domain
      },
      keycloak: {
        key: process.env.KEYCLOAK_CLIENT_ID,
        secret: process.env.KEYCLOAK_SECRET,
        oauth: 2,
        scope: ['openid'],
        authorize_url: keycloakBaseUrl + 'auth',
        access_url: keycloakBaseUrl + 'token',
        profile_url: keycloakBaseUrl + 'userinfo',
        nonce: true
      }
    },
    passwordPolicy: {
      minLength: 8,
      maxLength: 128,
      uppercase: true,
      lowercase: true,
      digits: true,
      symbols: true,
      prohibited: fs.readFileSync(path.join(__dirname, '10k_most_common_passwords.txt')).toString().split('\n'),
      history: 5
    },
    defaultUsers: [],
    // Required for OAuth2 to work correctly
    cookie: {
      enabled: true,
      name: 'feathers-jwt',
      httpOnly: false,
      secure: (process.env.NODE_ENV === 'development' ? false : true)
    },
    authorisation: {
      cache: {
        maxUsers: 1000
      }
    }
  },
  logs: {
    Console: {
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: (process.env.NODE_ENV === 'development' ? 'verbose' : 'info')
    },
    DailyRotateFile: {
      format: winston.format.json(),
      dirname: path.join(__dirname, '..', 'logs'),
      filename: 'teams-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    }
  },
  db: {
    adapter: 'mongodb',
    url: process.env.DB_URL || (containerized ? 'mongodb://mongodb:27017/teams' : 'mongodb://127.0.0.1:27017/teams')
  },
  storage: {
    s3Client: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
      },
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      signatureVersion: 'v4'
    },
    bucket: process.env.S3_BUCKET,
    //prefix: 'events'
  },
  'import-export': {
    s3Options: {
      s3Client: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        signatureVersion: 'v4'
      },
      bucket: process.env.S3_BUCKET,
      prefix: 'tmp'
    },
    workingDir: process.env.TMP_DIR || 'tmp'
  }
}