interface SentenceWord
{
	wordbank?: number,
	word: number,
	isName: boolean,
}

interface Sentence
{
	words: SentenceWord[],
	votes: number,
}


export default Sentence;

export { SentenceWord };
