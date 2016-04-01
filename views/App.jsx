var Fluxxor = require("fluxxor")
var React = require('react')
var StoragePanel = require("./StoragePanel.jsx")

var FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin


var Application = React.createClass({
	mixins : [FluxMixin, StoreWatchMixin("StorageStore")],

	getInitialState() {
		return {}
	},

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

	onClickRight() {
		this.getFlux().actions.carousel.nextImage()
	},

	onClickLeft() {
		this.getFlux().actions.carousel.previousImage()
	},

	onSelectImage(i) {
		this.getFlux().actions.carousel.selectImage(i)
	},

	onAddUrl(url) {
		this.getFlux().actions.carousel.addImage(url)
	},

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
