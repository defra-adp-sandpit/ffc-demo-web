const sessionHandler = require('../../services/session-handler')

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/claim/name',
    handler: {
      'hapi-govuk-question-page': {
        getConfig: () => {
          return {
            $VIEW$: { serviceName: 'FFC Demo Service' }
          }
        },
        getData: (request) => sessionHandler.get(request, 'claim'),
        getNextPath: () => './property-type',
        pageDefinition: require('./page-definitions/name')
      }
    },
    options: require('./question-page-options')
  }
]
