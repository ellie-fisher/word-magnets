import m, { Component } from "mithril";

import CreatePhaseController from "./CreatePhaseController";


const WordbankView: Component =
{
	view ({ attrs })
	{
		const
		{
			wordbank = {} as any,
			wordbankIndex = -1,
			isName = false,
			disableButtons = false,
		}
		= attrs as any;

		return m ("div",
		[
			m ("strong", wordbank.displayName),

			m ("div", wordbank.words.map (( word, wordIndex ) => m ("button",
			{
				disabled: disableButtons,

				onclick ()
				{
					let wordData: any = { isName };

					if ( isName )
					{
						wordData.word = word.id;
					}
					else
					{
						wordData.word = wordIndex;
						wordData.wordbank = wordbankIndex;
					}

					CreatePhaseController.addWord (wordData);
				},
			},
			isName ? word.name : word))),
		]);
	},
};


export default WordbankView;
