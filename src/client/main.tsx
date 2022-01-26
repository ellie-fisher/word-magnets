import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./app/App";

import store from "./store";

import "./sockets/socket";


ReactDOM.render (
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById ("app-root")
);
