import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import Client from "./Client";
import ClientInfo from "./ClientInfo";

import ObjectManager from "../misc/ObjectManager";


const DEFAULT_MAX_CLIENTS = 1000;


const ClientManager = new ObjectManager<Client> (DEFAULT_MAX_CLIENTS);

ClientManager._create = function ( id: string, socket: WebSocket, info: ClientInfo ): Client
{
	return new Client (id, socket, info);
};


export default ClientManager;
