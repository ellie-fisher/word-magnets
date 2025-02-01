import path from "node:path";
import express from "express";

import { WebSocketServer } from "ws";

import defaultConfig from "./default.config.json" with { type: "json" };
import customConfig from "./config.json" with { type: "json" };

import { onSocketConnection } from "./socket";

const config = { ...defaultConfig, ...customConfig };

const webServer = express();

webServer.use(express.static(path.join(import.meta.dirname, "../client/")));
webServer.listen(config.webServer.port, () => console.log(`Listening on port ${config.webServer.port}`));

const socketServer = new WebSocketServer({ port: config.webSocketServer.port });

socketServer.on("connection", onSocketConnection);
