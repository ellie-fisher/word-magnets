interface SentenceWord
{
	wordbank?: number,
	word: number | string,
	isName: boolean,
}

interface Sentence
{
	value: string,
	votes?: number,
	voteID?: number,
}


export default Sentence;

export { SentenceWord };
