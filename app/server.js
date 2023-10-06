const hapi = require('@hapi/hapi')
const config = require('./config')
const catbox = config.useRedis ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    },
    cache: [{
      name: config.cacheName,
      provider: {
        constructor: catbox,
        options: config.catboxOptions
      }
    }]
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register({
    plugin: require('@envage/hapi-govuk-question-page'),
    options: {
      pageTemplateName: '_layout.njk'
    }
  })
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/session-cache'))
  await server.register(require('./plugins/cookies'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  return server
}

module.exports = createServer
