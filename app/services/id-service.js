module.exports = {
  generateId: function () {
    const timestamp = new Date().getUTCMilliseconds()
    return `MINE${timestamp}`
  }
}
