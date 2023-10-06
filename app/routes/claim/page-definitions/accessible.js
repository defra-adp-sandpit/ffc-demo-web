module.exports = {
  submitButtonText: 'Save and continue',
  components: [{
    type: 'YesNoField',
    name: 'accessible',
    title: 'Is the property still accessible?',
    titleForError: 'If the property is still accessible',
    hint: 'You must be able to access the property safely.',
    options: {
      yesFirst: true
    }
  }]
}
