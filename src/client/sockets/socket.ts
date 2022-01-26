import store from "../store";

import packetManager from "./packetManager";

import isValidPacket from "../../common/packets/isValidPacket";
import socketConfig from "../../common/config/socketConfig";

import { APP_ID, APP_VER } from "../../common/config/appInfo";


const socket = new WebSocket (
	`${socketConfig.client.url}:${socketConfig.port}?appID=${APP_ID}&appVersion=${APP_VER}`
);

socket.onopen = function ()
{
	store.dispatch ({ type: "socket/opened" });
};

socket.onclose = function ( event: CloseEvent )
{
	store.dispatch (
	{
		type: "socket/closed",

		payload:
		{
			code: event.code,
			reason: event.reason,
		},
	});
};

socket.onerror = function ()
{
	store.dispatch ({ type: "socket/error" });
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
