const sessionHandler = require('../../services/session-handler')
const { asArray } = require('../../util/array-util')

const questionPageOptions = {
  ext: {
    onPostHandler: {
      method: async (request, h) => {
        if (request.app['hapi-govuk-question-page']) {
          const dataToSet = request.app['hapi-govuk-question-page'].data
          if (dataToSet.mineType !== undefined) {
            dataToSet.mineType = asArray(dataToSet.mineType)
          }
          sessionHandler.update(request, 'claim', dataToSet)
        }
        return h.continue
      }
    }
  }
}

module.exports = questionPageOptions
