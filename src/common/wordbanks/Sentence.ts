interface Sentence
{
	value: string,
	votes?: number,
	voteID?: number,
}

interface SentenceWord
{
	wordbank?: number,
	word: number | string,
	isName: boolean,
}


export default Sentence;

export { SentenceWord };
