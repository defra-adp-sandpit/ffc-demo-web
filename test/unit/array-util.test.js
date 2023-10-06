const { asArray } = require('../../app/util/array-util')
const item1 = 'one'
const item2 = 'two'
describe('array util', () => {
  test('asArray should return array unchanged', async () => {
    const input = [item1, item2]
    const output = asArray(input)
    expect(output.length).toEqual(2)
    expect(output[0]).toEqual(item1)
    expect(output[1]).toEqual(item2)
  })
  test('asArray should return object in an array', async () => {
    const input = item1
    const output = asArray(input)
    expect(output.length).toEqual(1)
    expect(output[0]).toEqual(item1)
  })
})
