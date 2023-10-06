const sessionHandler = require('../services/session-handler')

module.exports = {
  method: 'GET',
  path: '/clear-session',
  options: {
    handler: (request, h) => {
      sessionHandler.clear(request, 'claim')
      return h.redirect('/')
    }
  }
}
