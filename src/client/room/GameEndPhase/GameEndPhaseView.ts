import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import GameEndPhaseModel from "./GameEndPhaseModel";
import RoomController from "../RoomController";

import "./handlers/FinalScores";


const GameEndPhaseView: Component =
{
	view ()
	{
		const clients = GameEndPhaseModel.results.slice ();

		clients.sort (( clientA, clientB ) => clientB.score - clientA.score);

		return m ("table",
		[
			m ("thead", m ("tr",
			[
				m ("th", "Player"),
				m ("th", "Score"),
			])),

			m ("tbody", clients.map (cachedClient =>
			{
				const name = RoomController.hasClient (cachedClient.id)
					? RoomController.getClientName (cachedClient.id)
					: cachedClient.name;

				return m ("tr",
				{
					style: cachedClient.score >= clients[0].score
						? { "background-color": "#BBB787" }
						: {},
				},
				[
					m ("td", m ("strong", name)),
					m ("td", m ("span", cachedClient.score)),
				]);
			})),
		]);
	},
};


export default GameEndPhaseView;
