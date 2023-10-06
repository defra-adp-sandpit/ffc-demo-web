const ViewModel = require('./models/cookies-policy')
const { updatePolicy } = require('../../cookies')
const Joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', new ViewModel(request.state.cookies_policy, request.query.updated))
  }
}, {
  method: 'POST',
  path: '/cookies',
  options: {
    validate: {
      payload: Joi.object({
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false)
      })
    },
    handler: (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect('/cookies?updated=true')
    }
  }
}]
