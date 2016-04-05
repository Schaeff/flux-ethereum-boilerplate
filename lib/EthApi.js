var Web3 = require("web3");
var Pudding = require("ether-pudding");
// This bundle contains all compiled contracts
var contractsBuild = require("../contracts/build/bundle.sol.js")

var EthApi = function(host, port, contract_build_root) {

	console.log("constructor called", host, port, contract_build_root)
	this.node = {
		host: host,
		port: port
	}

	this.contract_build_root = contract_build_root
	this._setWeb3()
	this._setContracts()
}

EthApi.prototype._setContracts = function() {
	var contracts = {}
	for(var contract_name in contractsBuild) {
		contracts[contract_name] = Pudding.whisk({
				abi: contractsBuild[contract_name].abi,
				binary: contractsBuild[contract_name].bytecode
		})
	}

	this.contracts = contracts
}

EthApi.prototype._setWeb3 = function() {
	var web3 = new Web3();
	Pudding.setWeb3(web3);
	web3.setProvider(new Web3.providers.HttpProvider("http://" + this.node.host + ":" + this.node.port))
	this.web3 = web3
}

module.exports = EthApi