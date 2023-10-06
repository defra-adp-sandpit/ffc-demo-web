module.exports = {
  submitButtonText: 'Save and continue',
  components: [{
    type: 'RadiosField',
    name: 'propertyType',
    title: 'Which type of property are you claiming on?',
    titleForError: 'A valid property type',
    hint: 'Select which best describes the affected property.',
    options: {
      classes: 'govuk-radios--inline',
      list: {
        type: 'string',
        items: [
          { text: 'Home', value: 'home' },
          { text: 'Business', value: 'business' }
        ]
      }
    }
  }]
}
