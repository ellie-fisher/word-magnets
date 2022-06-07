import store from "../store";

import AppActions from "../app/actionCreators";

import packetManager from "./packetManager";

import isValidPacket from "../../common/packets/isValidPacket";
import socketConfig from "../../common/config/socketConfig";

import { APP_ID, APP_VER } from "../../common/config/appInfo";


const socket = new WebSocket (
	window.location.origin.indexOf ("https:") === 0 ? "wss://" : "ws://"
	+ `${window.location.hostname}:${socketConfig.port}?appID=${APP_ID}&appVersion=${APP_VER}`
);

socket.onopen = function ()
{
	store.dispatch (AppActions.socketOpened ());
};

socket.onclose = function ( event: CloseEvent )
{
	store.dispatch (AppActions.socketClosed (event.code, event.reason));
};

socket.onerror = function ()
{
	store.dispatch (AppActions.socketError ());
};

socket.onmessage = function ( event: MessageEvent<any> )
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
};


export default socket;
