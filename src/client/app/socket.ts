import m from "mithril";

import AppView from "../app/AppView";
import appState from "../app/state";

import packetManager from "../packets/packetManager";

import isValidPacket from "../../common/packets/isValidPacket";
import socketConfig from "../../common/config/socketConfig";


const socket = new WebSocket (`${socketConfig.client.url}:${socketConfig.port}`);

socket.onopen = function ()
{
	appState.view = AppView.Registration;
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
	let packet;

	try
	{
		packet = JSON.parse (event.data);

		if ( !isValidPacket (packet) )
		{
			throw new Error ("Invalid packet");
		}
	}
	catch ( error )
	{
		console.error ("Error parsing packet:", error);
		return;
	}

	packetManager.handlePacket (packet);

	m.redraw ();
};


export default socket;
