var Fluxxor = require("fluxxor")
var React = require('react')
var StoragePanel = require("./StoragePanel.jsx")

// Fluxxor provides tools to automaticatlly bind/unbind from change events coming from stores to avoid memory leak
var FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin

// The root component of our app

var Application = React.createClass({
	mixins : [FluxMixin, StoreWatchMixin("StorageStore")],

	getInitialState() {
		return {}
	},

	// Necessary for StoreWatchMixin to bind/unbind to store state
	getStateFromFlux() {
		var flux = this.getFlux();

		return {
			storage: flux.store("StorageStore").getState()
		}
	},

	render() {
		return (
		  <span className="application-container">
		    <StoragePanel address={this.state.storage.address} onDeploy={this.onDeployContract} onStore={this.onStore} value={this.state.storage.value} storing={this.state.storage.storing} onNewAddress={this.onNewAddress} />
		  </span>
	)
	},


	// Link to actions

	onStore(value) {
		this.getFlux().actions.storage.storeValue(value)
	},

	onNewAddress(addr) {
		this.getFlux().actions.storage.changeAddress(addr)
	},

	onDeployContract() {
		this.getFlux().actions.storage.deployContract()
	}

})

module.exports = Application
