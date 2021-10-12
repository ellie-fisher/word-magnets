import deepFreeze from "../../../../common/src/util/deepFreeze";


const apiRequest = deepFreeze (
{
	url: "https://api.wordnik.com/v4/words.json/randomWords",

	params:
	{
		hasDictionaryDef: true,

		minCorpusCount: 10000,
		maxCorpusCount: -1,

		minDictionaryCount: 1,
		maxDictionaryCount: -1,

		minLength: 3,
		maxLength: 20,

		limit: 16,
	},
});


export default apiRequest;
