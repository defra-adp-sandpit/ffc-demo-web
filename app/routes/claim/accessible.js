const sessionHandler = require('../../services/session-handler')

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/claim/accessible',
    handler: {
      'hapi-govuk-question-page': {
        getConfig: async () => {
          return {
            $VIEW$: { serviceName: 'FFC Demo Service' }
          }
        },
        getData: (request) => sessionHandler.get(request, 'claim'),
        getNextPath: () => './date-of-subsidence',
        pageDefinition: require('./page-definitions/accessible')
      }
    },
    options: require('./question-page-options')
  }
]
