import CreatePhaseModel from "./CreatePhaseModel";

import RoomController from "../RoomController";
import RoomModel from "../RoomModel";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../packets/packetManager";

import wordsToString from "../../../common/util/wordsToString";

import { SentenceWord } from "../../../common/wordbanks/Sentence";

import { MAX_SENTENCE_LEN } from "../../../common/rooms/constants";


const CreatePhaseController =
{
	addWord ( sentenceWord: SentenceWord )
	{
		const { sentence } = CreatePhaseModel;
		const { word, wordbank, isName = false } = sentenceWord;

		if ( isName )
		{
			if ( !RoomController.hasClient (word) )
			{
				return;
			}
		}
		else if ( !this.isValidWord (wordbank, word) )
		{
			return;
		}

		const testSentence = sentence.slice ();

		testSentence.push (sentenceWord);

		if ( this.sentenceToString (testSentence).length >= MAX_SENTENCE_LEN )
		{
			return;
		}

		sentence.push ({ ...sentenceWord });
	},

	sentenceToString ( sentence: SentenceWord[] ): string
	{
		return wordsToString (sentence.map (word =>
		{
			if ( word.isName )
			{
				if ( RoomController.hasClient (word.word) )
				{
					return RoomController.getClientName (word.word);
				}
			}
			else
			{
				return this.getWord (word.wordbank, word.word);
			}

			return "";
		}));
	},

	isValidWord ( wordbankIndex, wordIndex ): boolean
	{
		return this.isValidWordbank (wordbankIndex)
			&& Number.isInteger (wordIndex)
			&& wordIndex >= 0
			&& wordIndex < CreatePhaseModel.wordbanks[wordbankIndex].words.length;
	},

	isValidWordbank ( index ): boolean
	{
		return (Number.isInteger (index) && index >= 0 && index < CreatePhaseModel.wordbanks.length);
	},

	getWord ( wordbankIndex, wordIndex ): string
	{
		return this.isValidWord (wordbankIndex, wordIndex)
			? CreatePhaseModel.wordbanks[wordbankIndex].words[wordIndex]
			: "";
	},

	clearWordbanks ()
	{
		CreatePhaseModel.sentence = [];
		CreatePhaseModel.wordbanks = [];
	},
};


export default CreatePhaseController;
