import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import AppModel from "../../app/AppModel";

import RoomModel from "../RoomModel";
import RoomController from "../RoomController";

import LobbyPhaseController from "./LobbyPhaseController";


const LobbyPhaseView: Component =
{
	view ()
	{
		const isOwner = AppModel.clientID === RoomModel.info.ownerID;

		return m ("div",
		[
			m ("h3", "Pre-Game Lobby"),
			m ("small", "Waiting for room owner to start the game..."),

			m ("p",
			[
				m ("label", m ("strong", "Players: ")),

				m ("ul", Object.keys (RoomModel.clients).map (clientID =>
				{
					return m ("li", RoomController.getClientName (clientID));
				})),

				m ("hr"),

				!isOwner ? "" :
					m ("button",
					{
						onclick ()
						{
							LobbyPhaseController.startGame ();
						},
					}, "Start Game"),
			]),
		]);
	},
};


export default LobbyPhaseView;
