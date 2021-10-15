import deepFreeze from "../../common/util/deepFreeze";


const fixedWords = deepFreeze (
{
	grammar:
	[
		" ", "-.", "-,", "-!", "-?", "'-", "-'", "\"-", "-\"",
		"-\'ll", "-\'re", "-\'ve", "-n\'t", "-ing", "-ly",
		"-y", "-t", "-m", "-r", "-s", "-e", "-d",
	],

	pronouns:
	[
		"I",    "me",   "my",    "you", "your",
		"she",  "her",  "he",    "him", "his",
		"they", "them", "their", "we",  "us",
		"this", "that", "it",
	],

	misc:
	[
		"the",  "a",   "an",  "if",  "in",   "of",   "on",   "to",   "for", "and", "but", "or",
		"be",   "am",  "is",  "are", "was",  "were", "been", "will",
		"have", "has", "had", "do",  "does", "did",
		"yes",  "no",
	],
});


export default fixedWords;
