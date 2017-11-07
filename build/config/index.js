const devConfig = require('./development')

module.exports = Object.assign({
  banner: "Game Server Updated AT: " + new Date().toLocaleString()
}, devConfig)
