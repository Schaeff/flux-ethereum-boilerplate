var EthApi = require('../lib/EthApi.js')
var config = require('../config.json')
EthApi.connect(config.node.host, config.node.port)

var StorageActions = require('./StorageActions.jsx')

module.exports = {
	storage: StorageActions,
}