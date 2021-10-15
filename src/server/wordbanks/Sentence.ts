interface SentenceWord
{
	wordbank?: number,
	word: number | string,
	isName: boolean,
}

interface Sentence
{
	value: string,
	votes: number,
}

export default Sentence;

export { SentenceWord };
