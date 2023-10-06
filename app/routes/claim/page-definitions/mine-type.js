module.exports = {
  submitButtonText: 'Save and continue',
  components: [{
    type: 'CheckboxesField',
    name: 'mineType',
    title: 'Which types of mine are affected?',
    titleForError: 'The types of mine affected',
    hint: 'Select all mine types that apply.',
    options: {
      list: {
        name: 'mineType',
        type: 'string',
        items: [
          { text: 'Coal', value: 'coal' },
          { text: 'Gold', value: 'gold' },
          { text: 'Iron', value: 'iron' },
          { text: 'Other', value: 'other' }
        ]
      }
    }
  }
  ]
}
