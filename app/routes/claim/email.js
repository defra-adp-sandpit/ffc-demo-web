const sessionHandler = require('../../services/session-handler')
const idService = require('../../services/id-service')
const publishClaim = require('../../messaging/publish-claim')

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/claim/email',
    handler: {
      'hapi-govuk-question-page': {
        getConfig: async () => {
          return {
            $VIEW$: { serviceName: 'FFC Demo Service' }
          }
        },
        getData: (request) => sessionHandler.get(request, 'claim'),
        getNextPath: () => './confirmation',
        pageDefinition: require('./page-definitions/email')
      }
    },
    options: {
      ext: {
        onPostHandler: {
          method: async (request, h) => {
            if (request.app['hapi-govuk-question-page']) {
              sessionHandler.update(request, 'claim', request.app['hapi-govuk-question-page'].data)
              const claim = sessionHandler.get(request, 'claim')
              if (!claim.submitted) {
                try {
                  claim.claimId = idService.generateId()
                  sessionHandler.update(request, 'claim', claim)
                  await publishClaim(request)
                  console.log(`Submitted claim ${claim.claimId}`)
                  claim.submitted = true
                  sessionHandler.update(request, 'claim', claim)
                } catch (err) {
                  console.error('Failed to submit claim', err)
                  return h.view('service-unavailable')
                }
              }
              return h.redirect('./confirmation')
            }
            return h.continue
          }
        }
      }
    }
  }
]
