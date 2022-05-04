import { AnyObject } from "../../../common/util/types";
import { SentenceWord } from "../../../common/wordbanks/Sentence";


const CreatePhaseActions =
{
	wordbanks ( wordbanks: AnyObject )
	{
		return {
			type: "room/create/wordbanks",
			payload: wordbanks,
		};
	},

	addWord ( word: SentenceWord )
	{
		return {
			type: "room/create/addWord",
			payload: { word },
		};
	},
};


export default CreatePhaseActions;
