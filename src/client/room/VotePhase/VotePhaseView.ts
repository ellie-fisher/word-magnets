import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import VotePhaseController from "./VotePhaseController";
import VotePhaseModel from "./VotePhaseModel";

import "./handlers/SentenceList";


const VotePhaseView: Component =
{
	view ()
	{
		return m ("div", VotePhaseModel.sentenceList.map (sentenceData => m ("div",
		[
			m ("button", "Vote"),
			m ("pre", sentenceData.voteID),
			m ("span", sentenceData.value),
		])));
	},
};


export default VotePhaseView;
