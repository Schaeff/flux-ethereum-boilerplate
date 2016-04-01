var constants = require("../constants")
var path = require('path')
var Fluxxor = require('fluxxor')
var EthApi = require('../lib/EthApi.js')
var config = require('../config.json')
var ethApi = new EthApi(config.node.host, config.node.port, config.contracts, config.build_dir)
window.ethApi = ethApi

var actions = {	
	storeValue(val) {
		// Broadcast for optimistic update
		this.dispatch(constants.STORING, {value: Number(val)})

		// Actual call
		var address = this.flux.store("StorageStore").address

		ethApi.contracts.SimpleStorage
			.at(address)
			.set(val, {from: ethApi.web3.eth.coinbase})
			.bind(this)
			.then(function(res) {
				this.dispatch(constants.STORED_OK)
			})
			.catch(function(err) {
				this.dispatch(constants.STORED_FAIL)
			})
	},

	deployContract() {
		var that = this
		ethApi.contracts.SimpleStorage
			.new({from: ethApi.web3.eth.coinbase})
			.then(function(instance) {
				ethApi.contracts.SimpleStorage.at(instance.address)
					.newData()
					.watch(function(err, val) {
						that.dispatch(constants.NEW_VALUE, {value: Number(val.args.newData.toString())})
					})
				that.dispatch(constants.DEPLOYED, {address: instance.address})

			})
			.catch(function(err) {
				that.dispatch(constants.DEPLOY_FAIL, {err: err})
			})
	}
}

module.exports = actions