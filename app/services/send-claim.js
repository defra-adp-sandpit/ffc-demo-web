const sessionHandler = require('./session-handler')
const { publishClaim } = require('../messaging/publish-claim')

module.exports = {
  submit: async (request) => {
    try {
      const claim = sessionHandler.get(request, 'claim')
      console.log(`Submitting claim ${claim.claimId}`)
      await publishClaim(claim)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}
