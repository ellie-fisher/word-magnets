import m, { Component } from "mithril";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import AppModel from "../app/AppModel";
import RoomController from "./RoomController";
import RoomModel from "./RoomModel";
import ViewEnum from "../app/ViewEnum";

import "./handlers/RoomInfo";


const RoomView: Component =
{
	view ()
	{
		const { info } = RoomModel;

		const headingStyle = { padding: "1vw" };

		return m ("div",
		[
			m ("span", { style: headingStyle }, [m ("strong", "Time Left: "), info.timeLeft]),
			m ("span", { style: headingStyle }, [m ("strong", "Round: "), `${info.currentRound} of ${info.maxRounds}`]),
		]);
	},
};


export default RoomView;
