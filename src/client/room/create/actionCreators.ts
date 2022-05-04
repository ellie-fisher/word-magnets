import { AnyObject } from "../../../common/util/types";
import { SentenceWord } from "../../../common/wordbanks/Sentence";


const CreatePhaseActions =
{
	wordbanks ( wordbanks: AnyObject )
	{
		return {
			type: "room/sentence/wordbanks",
			payload: wordbanks,
		};
	},

	addWord ( word: SentenceWord )
	{
		return {
			type: "room/sentence/addWord",
			payload: { word },
		};
	},
};


export default CreatePhaseActions;
