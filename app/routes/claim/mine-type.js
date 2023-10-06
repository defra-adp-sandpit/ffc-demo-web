const sessionHandler = require('../../services/session-handler')

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/claim/mine-type',
    handler: {
      'hapi-govuk-question-page': {
        getConfig: async () => {
          return {
            $VIEW$: { serviceName: 'FFC Demo Service' }
          }
        },
        getData: (request) => sessionHandler.get(request, 'claim'),
        getNextPath: () => './email',
        pageDefinition: require('./page-definitions/mine-type')
      }
    },
    options: require('./question-page-options')
  }
]
