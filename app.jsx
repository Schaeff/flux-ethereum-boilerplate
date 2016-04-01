var Fluxxor = require("fluxxor")

var StorageStore = require("./stores/StorageStore.jsx")

var actions = require("./actions/Actions.jsx")

var App = require("./views/App.jsx")
var ReactDOM = require("react-dom")
var React = require("react")

var stores = {
	StorageStore: new StorageStore({})
}

var flux = new Fluxxor.Flux(stores, actions)

flux.on("dispatch", function(type, payload) {
	if(console && console.log) {
		console.log("[Dispatch]", type, payload)
	}
})

ReactDOM.render(<App flux={flux} />, document.getElementById("content"));