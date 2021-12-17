import Client from "./clients/Client";
import ClientInfo from "./clients/ClientInfo";
import ClientManager from "./clients/ClientManager";
import ClientNames from "./clients/ClientNames";

import RoomManager from "./rooms/RoomManager";

import Packet from "../common/packets/Packet";
import PacketCommand from "../common/packets/PacketCommand";
import isValidPacket from "../common/packets/isValidPacket";
import registerHandlers from "./packets/registerHandlers";

import validateFields from "./validation/validateFields";
import clientInfoFields from "../common/validation/fields/clientInfo";


const CLOSE_SERVER_ERR = 1011;
const CLOSE_TRY_AGAIN = 1013;

const onNewConnection = function ( socket: any, request: any )
{
	if ( ClientManager.hasReachedMax () )
	{
		const { maxObjects } = ClientManager;

		socket.close (
			CLOSE_TRY_AGAIN,
			`The server can only support up to ${maxObjects} connection${maxObjects != 1 ? "s" : ""}.`
				+ " Please try again later."
		);

		return;
	}

	const client = ClientManager.create (socket, new ClientInfo ({ name: "" }));

	if ( client === null )
	{
		socket.close (CLOSE_SERVER_ERR, "A major error has occurred. Please try again later.");
		return;
	}

	console.log (`New connection: ${client.id}`);

	registerHandlers (client);

	socket.on ("message", onSocketMessage);
	socket.on ("close", onSocketClose);
};

const onSocketClose = function ( this: any )
{
	const { __$_gameClient } = this;

	if ( __$_gameClient.roomID !== "" )
	{
		RoomManager.leaveRoom (__$_gameClient);
	}

	ClientManager.remove (__$_gameClient.id);
	ClientNames.removeClient (__$_gameClient);

	console.log (`${__$_gameClient.id} disconnected.`);
};

const onSocketMessage = function ( this: any, message: any )
{
	console.log ("onSocketMessage:", message.toString ());

	const client: Client = this.__$_gameClient;

	let packet;

	try
	{
		packet = JSON.parse (message);

		console.log ("PACKET", packet);

		if ( !isValidPacket (packet) )
		{
			throw new Error ("Invalid packet");
		}
	}
	catch ( error: any )
	{
		let errorMessage = "Internal server error";

		if ( error instanceof SyntaxError )
		{
			errorMessage = "Malformed packet";
		}
		else if ( error.message === "Invalid packet" )
		{
			errorMessage = error.message;
		}
		else
		{
			console.error ("Packet JSON parsing error:", error.message);
		}

		client.packets.sendErrorPacket (errorMessage);
		return;
	}

	if ( client.info.name === "" && packet.command !== PacketCommand.RegisterInfo )
	{
		client.packets.sendRejectPacket (packet, "Please set your name first.");
		return;
	}

	client.packets.handlePacket (packet, client);
};


export default onNewConnection;
