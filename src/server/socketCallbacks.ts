import Client from "./clients/Client";
import ClientInfo from "./clients/ClientInfo";
import ClientManager from "./clients/ClientManager";

import RoomManager from "./rooms/RoomManager";

import Packet from "../common/packets/Packet";
import PacketCommand from "../common/packets/PacketCommand";
import isValidPacket from "../common/packets/isValidPacket";
import registerHandlers from "./packets/registerHandlers";

import validateFields from "./validation/validateFields";
import clientInfoFields from "../common/validation/fields/clientInfo";

import { ObjectCreateError } from "./misc/ObjectManager";


const CLOSE_SERVER_ERR = 1011;
const CLOSE_TRY_AGAIN = 1013;

const onNewConnection = function ( socket: any, request: any )
{
	const clientOrError = ClientManager.create (socket, new ClientInfo ({ name: "" }));

	if ( !(clientOrError instanceof Client) )
	{
		socket.close (
			(clientOrError === ObjectCreateError.GenerateID || clientOrError === ObjectCreateError.ObjectLimit)
				? CLOSE_TRY_AGAIN
				: CLOSE_SERVER_ERR,
			ClientManager.getCreateErrorMessage (clientOrError as ObjectCreateError),
		);

		return;
	}

	const client = clientOrError as Client;

	console.log (`New connection: ${client.id}`);

	registerHandlers (client);

	client.packets.sendDataPacket (PacketCommand.ClientConnected, client.id);

	socket.on ("message", onSocketMessage);
	socket.on ("close", onSocketClose);
};

const onSocketClose = function ( this: any )
{
	const { __$_gameClient } = this;

	if ( __$_gameClient.isInRoom () )
	{
		RoomManager.leaveRoom (__$_gameClient);
	}

	ClientManager.remove (__$_gameClient.id);

	console.log (`${__$_gameClient.id} disconnected.`);
};

const onSocketMessage = function ( this: any, message: any )
{
	// FIXME: Remove
	console.log ("onSocketMessage:", message.toString ());

	const client: Client = this.__$_gameClient;

	let packet;

	try
	{
		packet = JSON.parse (message);

		// FIXME: Remove
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

	client.packets.handlePacket (packet, client);
};


export default onNewConnection;
