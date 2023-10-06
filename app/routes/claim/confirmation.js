const sessionHandler = require('../../services/session-handler')
const ViewModel = require('./models/confirmation')

module.exports = {
  method: 'GET',
  path: '/claim/confirmation',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'claim')
      return h.view('claim/confirmation', new ViewModel(claim))
    }
  }
}
