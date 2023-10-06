function ViewModel (claim) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    titleText: 'Application complete',
    html: `Your reference number<br><strong>${claim.claimId}</strong>`
  }
}

module.exports = ViewModel
