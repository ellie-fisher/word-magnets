import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import RoomController from "../RoomController";
import RoomModel from "../RoomModel";


const GameEndPhaseView: Component =
{
	view ()
	{
		const { clients } = RoomModel;

		const clientArray = Object.keys (clients).map (clientID =>
		{
			return { ...clients[clientID] };
		});

		clientArray.sort (( clientA, clientB ) => clientB.score - clientA.score);

		return m ("table",
		[
			m ("thead", m ("tr",
			[
				m ("th", "Player"),
				m ("th", "Score"),
			])),

			m ("tbody", clientArray.map (client =>
			{
				return m ("tr",
				{
					style: client.score >= clientArray[0].score
						? { "background-color": "#BBB787" }
						: {},
				},
				[
					m ("td", m ("strong", client.name)),
					m ("td", m ("span", client.score)),
				]);
			})),
		]);
	},
};


export default GameEndPhaseView;
