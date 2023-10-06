const sessionHandler = require('../../services/session-handler')

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/claim/date-of-subsidence',
    handler: {
      'hapi-govuk-question-page': {
        getConfig: async () => {
          return {
            $VIEW$: { serviceName: 'FFC Demo Service' }
          }
        },
        getData: (request) => {
          const { dateOfSubsidence } = sessionHandler.get(request, 'claim')
          const date = dateOfSubsidence ? new Date(dateOfSubsidence) : undefined
          return { dateOfSubsidence: date }
        },
        setData: async (request, data) => {
          const dateOfSubsidence = data.dateOfSubsidence
          if (dateOfSubsidence > new Date()) {
            return {
              errors: { titleText: 'Fix the following errors', errorList: [{ href: '#dateOfSubsidence', name: 'dateOfSubsidence', text: 'Date has to be in the past' }] }
            }
          }
        },
        getNextPath: () => './mine-type',
        pageDefinition: require('./page-definitions/date-of-subsidence')
      }
    },
    options: require('./question-page-options')
  }
]
