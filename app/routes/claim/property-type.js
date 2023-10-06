const sessionHandler = require('../../services/session-handler')

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/claim/property-type',
    handler: {
      'hapi-govuk-question-page': {
        getConfig: () => {
          return {
            $VIEW$: { serviceName: 'FFC Demo Service' }
          }
        },
        getData: (request) => sessionHandler.get(request, 'claim'),
        getNextPath: () => './accessible',
        pageDefinition: require('./page-definitions/property-type')
      }
    },
    options: require('./question-page-options')
  }
]
