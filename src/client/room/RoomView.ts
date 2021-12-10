import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import AppModel from "../app/AppModel";
import RoomController from "./RoomController";
import RoomModel from "./RoomModel";
import ViewEnum from "../app/ViewEnum";
import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";

import CreatePhaseView from "./CreatePhase/CreatePhaseView";

import "./handlers/RoomInfo";
import "./handlers/StartPhase";
import "./handlers/EndPhase";
import "./handlers/ClientList";
import "./handlers/JoinRoom";


const RoomView: Component =
{
	view ()
	{
		const { info, phase } = RoomModel;

		const headingStyle = { padding: "1vw" };

		let view: any;

		switch ( phase )
		{
			case RoomPhaseType.Create:
				view = m (CreatePhaseView);
				break;

			default:
				view = m ("div", [m ("strong", "ERROR:"), " Unknown/Unhandled room phase"]);
				break;
		}

		return m ("div",
		[
			m ("span", { style: headingStyle }, [m ("strong", "Time Left: "), info.timeLeft]),
			m ("span", { style: headingStyle }, [m ("strong", "Round: "), `${info.currentRound} of ${info.maxRounds}`]),
			m ("span", { style: headingStyle }, [m ("strong", "ID: "), info.id]),

			m ("hr"),

			view,
		]);
	},
};


export default RoomView;
