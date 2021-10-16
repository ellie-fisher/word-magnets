import m from "mithril";


import appState from "../app/state";
import AppView from "../app/AppView";

import socketConfig from "../../common/config/socketConfig";


const socket = new WebSocket (`${socketConfig.client.url}:${socketConfig.port}`);

socket.onopen = function ()
{
	console.info ("Open");
	m.redraw ();
};

socket.onclose = function ( event )
{
	appState.view = AppView.SocketError;
	appState.socketErrorMsg = event.reason;

	m.redraw ();
};

socket.onerror = function ( event )
{
	appState.view = AppView.SocketError;
	appState.socketErrorMsg = "Unexpected socket error.";

	console.log ("Socket Error:", event);

	m.redraw ();
};

socket.onmessage = function ( event )
{
	console.log (JSON.parse (event.data));
	m.redraw ();
};


export default socket;
