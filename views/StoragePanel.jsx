var React = require('react');

var StoragePanel = React.createClass({

	getInitialState() {
		return {
			newValue: 0,
			addr: '' 
		};
	},

	render() {
		return (
			<div id="panel">
				<h1>Simple contract</h1>
				<div>
					<input type="button" onClick={this.onDeploy} value="Deploy contract" /> 
				</div>
				<form onSubmit={this.onSubmit} >
					<input type="number" onChange={this.onChange} value={this.state.newValue} />
					<input type="submit" value="Store!" />
				</form>
				<h2> Value : {this.props.value}</h2>
				<h3>Storing : {this.props.storing ? "yes" : "no"}</h3>
				<h3> Address : {this.props.address}</h3>
			</div>
		);
	},

	onChange(e) {
		this.setState({
			newValue: e.target.value 
		});
	},

	onChangeAddr(e) {
		this.setState({
			addr: e.target.value 
		});
	},

	onNewAddress(e) {
		e.preventDefault()
		this.props.onNewAddress(this.state.addr)
	},

	onSubmit(e) {
		e.preventDefault()
		this.props.onStore(this.state.newValue)
		this.setState({
			newValue: 0
		})
	},

	onDeploy() {
		this.props.onDeploy()
	}

});

module.exports = StoragePanel;