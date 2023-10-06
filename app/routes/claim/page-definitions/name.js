module.exports = {
  submitButtonText: 'Save and continue',
  components: [
    {
      type: 'TextField',
      name: 'name',
      title: 'What is your name?',
      hint: 'Full name',
      titleForError: 'Your name',
      options: { classes: 'govuk-input--width-20' }
    }
  ]
}
