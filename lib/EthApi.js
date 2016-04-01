var Web3 = require("web3");
var Pudding = require("ether-pudding");

var EthApi = function(host, port, contract_names, contract_build_root) {

	console.log("constructor called", host, port, contract_names)
	this.node = {
		host: host,
		port: port
	}

	this.contract_build_root = contract_build_root
	this._setWeb3()
	this._setContracts(contract_names)
}

EthApi.prototype._setContracts = function(contract_names) {
	var contracts = {}

	contract_names.forEach(function(contract_name) {
		//var contract_file = require("../contracts/build/SimpleStorage.sol.js")
		var contract_file = require("../" + this.contract_build_root + contract_name + ".sol.js")
		contracts[contract_name] = Pudding.whisk({
			abi: contract_file.abi,
			binary: contract_file.bytecode
		})
	}.bind(this))

	this.contracts = contracts
}

EthApi.prototype._setWeb3 = function() {
	delete this.web3
	var web3 = new Web3();
	Pudding.setWeb3(web3);
	web3.setProvider(new Web3.providers.HttpProvider("http://" + this.node.host + ":" + this.node.port))
	this.web3 = web3
}

module.exports = EthApi