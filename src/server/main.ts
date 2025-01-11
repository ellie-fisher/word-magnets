import path from "node:path";
import express from "express";

import { IncomingMessage } from "node:http";
import { WebSocketServer } from "ws";

import config from "./config.json" with { type: "json" };

const webServer = express();

webServer.use(express.static(path.join(import.meta.dirname, "../client/")));
webServer.listen(config.webServer.port, () => console.log(`Listening on port ${config.webServer.port}`));

const socketServer = new WebSocketServer({ port: config.webSocketServer.port });

socketServer.on("connection", (_, request: IncomingMessage) =>
{
	console.log(`New connection: ${request.socket.remoteAddress}`);
});
