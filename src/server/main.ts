const path = require ("path");
const express = require ("express");
const ws = require ("ws");

import onNewConnection from "./socketCallbacks";

import serverConfig from "./config/serverConfig";
import socketConfig from "../common/config/socketConfig";


const app = express ();
const WebSocketServer = ws.Server;


app.listen (serverConfig.port, () =>
{
	console.log (`Listening on port ${serverConfig.port}`);
});

app.use ("/", express.static (path.join (__dirname, "../../dist/client")));

app.get ("/*", ( req: any, res: any ) =>
{
	res.sendFile ("index.html", { root: path.join (__dirname, "../../dist/client") });
});

const wss = new WebSocketServer ({ port: socketConfig.port }, () =>
{
	console.log (`Farragomate server started on port ${socketConfig.port}`);
});

wss.on ("connection", onNewConnection);
