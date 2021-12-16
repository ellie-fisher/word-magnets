import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import RoomController from "../RoomController";
import VotePhaseModel from "../VotePhase/VotePhaseModel";
import ResultsPhaseController from "./ResultsPhaseController";
import ResultsPhaseModel from "./ResultsPhaseModel";

import "./handlers/SentenceScores";


const ResultsPhaseView: Component =
{
	view ()
	{
		const { sentenceScores } = ResultsPhaseModel;

		const scoreArray = Object.keys (sentenceScores).map (clientID =>
		{
			return { ...sentenceScores[clientID], clientID };
		});

		scoreArray.sort (( sentenceA, sentenceB ) => sentenceB.votes - sentenceA.votes);

		return scoreArray.length <= 0 ? "No results to show. Either nobody submitted anything, or they left."
			: m ("table",
			[
				m ("thead", m ("tr",
				[
					m ("th", "Author"),
					m ("th", "Vote ID"),
					m ("th", "Sentence"),
					m ("th", "Votes"),
				])),

				m ("tbody", scoreArray.map (sentenceData =>
				{
					return m ("tr",
					{
						style: sentenceData.voteID === VotePhaseModel.vote
							? { "background-color": "#BB87B7" }
							: {},
					},
					[
						m ("td", m ("strong", RoomController.getClientName (sentenceData.clientID))),
						m ("td", m ("pre", sentenceData.voteID)),
						m ("td", m ("span", sentenceData.value)),
						m ("td", m ("span", sentenceData.votes)),
					]);
				})),
			]);
	},
};


export default ResultsPhaseView;
