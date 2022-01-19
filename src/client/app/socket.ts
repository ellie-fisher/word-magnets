import m from "mithril";

import ViewEnum from "../app/ViewEnum";
import AppModel from "../app/AppModel";

import packetManager from "../packets/packetManager";

import isValidPacket from "../../common/packets/isValidPacket";
import socketConfig from "../../common/config/socketConfig";

import { APP_ID, APP_VER } from "../../common/config/appInfo";


const socket = new WebSocket (
	`${socketConfig.client.url}:${socketConfig.port}?appID=${APP_ID}&appVersion=${APP_VER}`
);

socket.onopen = function ()
{
	m.redraw ();
};

socket.onclose = function ( event )
{
	AppModel.view = ViewEnum.SocketError;

	if ( event.reason === "" )
	{
		AppModel.socketErrorMsg = `The connection to the server closed. (Code: ${event.code})`;
	}
	else
	{
		AppModel.socketErrorMsg = event.reason;
	}

	m.redraw ();
};

socket.onerror = function ( event )
{
	AppModel.view = ViewEnum.SocketError;
	AppModel.socketErrorMsg = "Unexpected socket error.";

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
