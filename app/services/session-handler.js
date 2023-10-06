const hoek = require('@hapi/hoek')

module.exports = {
  get: function (request, key) {
    let object = request.yar.get(key)
    if (object == null) {
      object = {}
    }
    return object
  },
  set: function (request, key, value) {
    request.yar.set(key, value)
  },
  update: function (request, key, object) {
    const existing = this.get(request, key)
    hoek.merge(existing, object, { mergeArrays: false })
    this.set(request, key, existing)
  },
  clear: function (request, key) {
    request.yar.clear(key)
  }
}
