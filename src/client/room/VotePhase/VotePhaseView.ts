import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import VotePhaseController from "./VotePhaseController";
import VotePhaseModel from "./VotePhaseModel";

import "./handlers/SentenceList";
import "./handlers/PhaseData";


const VotePhaseView: Component =
{
	view ()
	{
		return VotePhaseModel.sentenceList.length <= 0 ? "No sentences are available."
			: m ("table",
			[
				m ("thead", m ("tr",
				[
					m ("th", ""),
					m ("th", "Vote ID"),
					m ("th", "Sentence"),
				])),

				m ("tbody", VotePhaseModel.sentenceList.map (sentenceData =>
				{
					return m ("tr",
					{
						style: sentenceData.voteID === VotePhaseModel.vote
							? { "background-color": "#7B87B7" }
							: {},
					},
					[
						m ("td", m ("button",
						{
							onclick ()
							{
								VotePhaseController.setVote (sentenceData.voteID);
							},
						}, "Vote")),

						m ("td", m ("pre", sentenceData.voteID)),
						m ("td", m ("span", sentenceData.value)),
					]);
				})),
		]);
	},
};


export default VotePhaseView;
