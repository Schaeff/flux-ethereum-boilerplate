var Fluxxor = require('fluxxor')
var constants = require('../constants')

var StorageStore = Fluxxor.createStore({
	initialize(options) {
		this.address = options.address || '0x'
		this.value = options.count || 0
		this.storing = options.storing || false
		this.backup = options.backup || 0

		this.bindActions(
			constants.STORING, this.onStoring,
			constants.STORED_OK, this.onStoredOk,
			constants.DEPLOYED, this.onDeployed,
			constants.STORED_FAIL, this.onStoredFail,
			constants.NEW_VALUE, this.onNewValue
		)
	},

	onDeployed(payload) {
		this.address = payload.address
		this.value = 0
		this.emit("change")
	},

	onStoring(payload) {
		this.storing = true
		this.backup = this.value
		this.value = payload.value
		this.emit("change")
	},

	onNewValue(payload) {
		this.storing = false
		this.value = payload.value
		this.emit("change")
	},

	onStoredOk() {
		this.storing = false
		this.emit("change")
	},

	onStoredFail() {
		this.storing = false
		this.value = this.backup
		this.emit("change")
	},

	getState() {
		return {
			value: this.value,
			storing: this.storing,
			address: this.address
		}
	},
})

module.exports = StorageStore