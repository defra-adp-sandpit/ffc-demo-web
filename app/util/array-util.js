function asArray (item) {
  return Array.isArray(item) ? item : [item]
}

module.exports = {
  asArray
}
