// Require React and app root
var App = require("./views/App.jsx")
var ReactDOM = require("react-dom")
var React = require("react")

var Fluxxor = require("fluxxor")

// Require stores
var stores = require("./stores")

// Initialize stores
var stores = {
	StorageStore: new stores.StorageStore({})
}

// Require actions
var actions = require("./actions")

// Initialize Flux instance
var flux = new Fluxxor.Flux(stores, actions)

// Monitor action dispatch
flux.on("dispatch", function(type, payload) {
	if(console && console.log) {
		console.log("[Dispatch]", type, payload)
	}
})

// Render App
ReactDOM.render(<App flux={flux} />, document.getElementById("content"));