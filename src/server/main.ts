const path = require ("path");
const express = require ("express");
const ws = require ("ws");

import onNewConnection from "./socketCallbacks";

const app = express ();
const WebSocketServer = ws.Server;

const PORT = 3000;
const SOCKET_PORT = 8080;

app.listen (PORT, () =>
{
	console.log (`Listening on port ${PORT}`);
});

app.use ("/", express.static (path.join (__dirname, "../client")));

app.get ("/*", ( req: any, res: any ) =>
{
	res.sendFile ("index.html", { root: path.join (__dirname, "../client") });
});

const wss = new WebSocketServer ({ port: SOCKET_PORT }, () =>
{
	console.log (`Farragomate server started on port ${SOCKET_PORT}`);
});

wss.on ("connection", onNewConnection);
