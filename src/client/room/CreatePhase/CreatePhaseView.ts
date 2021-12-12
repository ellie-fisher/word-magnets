import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import AppModel from "../../app/AppModel";
import RoomModel from "../RoomModel";

import CreatePhaseController from "./CreatePhaseController";
import CreatePhaseModel from "./CreatePhaseModel";

import WordbankView from "./WordbankView";

import wordsToString from "../../../common/util/wordsToString";

import "./handlers/Wordbanks";


const CreatePhaseView: Component =
{
	view ()
	{
		return m ("div",
		[
			m (WordbankView,
			{
				wordbank:
				{
					displayName: "Player Names",
					words: Object.keys (RoomModel.clients).map (id => RoomModel.clients[id]),
				},

				isName: true,
				disableButtons: RoomModel.isPhaseEnd,
			} as any),

			...CreatePhaseModel.wordbanks.map (( wordbank, wordbankIndex ) =>
			{
				return m (WordbankView,
				{
					wordbank,
					wordbankIndex,
					isName: false,
					disableButtons: RoomModel.isPhaseEnd,
				} as any);
			}),

			m ("hr"),

			m ("div", CreatePhaseController.sentenceToString (CreatePhaseModel.sentence)),
		]);
	},
};


export default CreatePhaseView;
