function createMessage (claim) {
  return {
    body: claim,
    type: 'uk.gov.demo.claim.submitted',
    source: 'ffc-demo-web'
  }
}

module.exports = createMessage
