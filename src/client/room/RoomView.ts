import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import AppModel from "../app/AppModel";
import RoomController from "./RoomController";
import RoomModel from "./RoomModel";
import ViewEnum from "../app/ViewEnum";
import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";

import LobbyPhaseView from "./LobbyPhase/LobbyPhaseView";
import CreatePhaseView from "./CreatePhase/CreatePhaseView";
import VotePhaseView from "./VotePhase/VotePhaseView";
import ResultsPhaseView from "./ResultsPhase/ResultsPhaseView";
import GameEndPhaseView from "./GameEndPhase/GameEndPhaseView";

import "./handlers/RoomInfo";
import "./handlers/PhaseData";
import "./handlers/ClientList";
import "./handlers/JoinRoom";
import "./handlers/LeaveRoom";


const RoomView: Component =
{
	view ()
	{
		const { info, phaseType } = RoomModel;

		const headingStyle = { padding: "1vw" };

		let view: any;

		switch ( phaseType )
		{
			case RoomPhaseType.Lobby:
				view = m (LobbyPhaseView);
				break;

			case RoomPhaseType.Create:
				view = m (CreatePhaseView);
				break;

			case RoomPhaseType.Vote:
				view = m (VotePhaseView);
				break;

			case RoomPhaseType.Results:
				view = m (ResultsPhaseView);
				break;

			case RoomPhaseType.GameEnd:
				view = m (GameEndPhaseView);
				break;

			default:
				view = m ("div", [m ("strong", "ERROR:"), " Unknown/Unhandled room phase"]);
				break;
		}

		return m ("div",
		[
			m ("button",
			{
				onclick ()
				{
					RoomController.leaveRoom ();
				},
			}, "<< Leave Room"),

			m ("span", { style: headingStyle }, [m ("strong", "Time Left: "), info.timeLeft]),
			m ("span", { style: headingStyle }, [m ("strong", "Round: "), `${info.currentRound} of ${info.maxRounds}`]),

			m ("span", { style: headingStyle },
			[
				m ("strong", "ID: "),
				m ("span",
				{
					style:
					{
						"font-family": "monospace",
						"font-size": "1vw",
					},
				}, info.id),
			]),

			m ("hr"),

			view,
		]);
	},
};


export default RoomView;
