import m, { Component } from "mithril";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import AppModel from "../../app/AppModel";
import RoomModel from "../RoomModel";
import CreatePhaseController from "./CreatePhaseController";
import CreatePhaseModel from "./CreatePhaseModel";

import "./handlers/Wordbanks";


const CreatePhaseView: Component =
{
	view ()
	{
		const { wordbanks } = CreatePhaseModel;

		return m ("div", wordbanks.map (wordbank =>
		{
			return m ("div",
			[
				m ("strong", wordbank.displayName),

				m ("div", wordbank.words.map (word => m ("button",
				{
					disabled: RoomModel.isPhaseEnd,
				},
				word))),
			]);
		}));
	},
};


export default CreatePhaseView;
