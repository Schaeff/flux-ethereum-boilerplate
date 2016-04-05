var assert = require('assert');

describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal(-1, [1, 2, 3].indexOf(5));
			assert.equal(-1, [1, 2, 3].indexOf(0));
		});
	});
});

describe('EthApi', function() {
	var EthApi = require('../lib/EthApi.js')
	var node = {
		host: 'localhost',
		port: 8545
	}

	describe('#connect', function() {
		it('should set node', function(done) {
			EthApi.connect(node.host, node.port)
			assert.equal(EthApi.node.host, "localhost")
			assert.equal(EthApi.node.port, 8545)
			done()
		})
		it('should set contracts', function() {
			EthApi.connect(node.host, node.port)
			assert.ok(EthApi.contracts)
		})
	})
})