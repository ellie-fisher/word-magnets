/**
 * Regex hieroglyphics.
 *
 * This is the non-optional slur filter for sentences and player names.
 *
 * These generally account for spaces, repeat characters, characters that look similar (i, l, 1, !, etc.),
 * and so on. Many have special rules and exceptions but this is generally how they work.
 *
 * If you want to see what they do, put them in RegExr -- I could not have made these without it.
 *
 * I have no doubt people will be able to bypass this. People are very creative at getting around
 * word filters. This is just to provide some deterrence and prevent certain words from appearing
 * in the wordbanks.
 *
 * In a perfect world we wouldn't need this. Sigh...
 */

const slurFilter =
[
	// Censor permutations of various racist slurs.
	"n+((\\s|\\W)*(e|3))+((\\s|\\W)*g)+((\\s|\\W)*r)+((\\s|\\W)*(o|0))+\\w*",
	"j+(\\s|\\W)*(a|4|@)+(\\s|\\W)*p+(\\s|\\W)*([sz]+|\\b)",
	"g+((\\s|\\W)*(o|0))+((\\s|\\W)*(o|0))+k+",
	"(\\b|[^a-z0-9])s+((\\s|\\W)*p)+((\\s|\\W)*(i|l|1|!))+((\\s|\\W)*(c|k))+((\\s|\\W)*(s|z|5|\\$|\\b))+",
	"(\\b|[^a-z0-9])s+((\\s|\\W)*p)+((\\s|\\W)*(i|l|1|!))+((\\s|\\W)*(c|k))+((\\s|\\W)*(k))+\\w*",
	"(\\b|[^a-z0-9])w+((\\s|\\W)*(e|3))+((\\s|\\W)*t)+((\\s|\\W)*b)+((\\s|\\W)*(a|4|@))+((\\s|\\W)*(c|k))+\\w*",

	// Censor permutations of the N-word.
	"(\\b|[^a-z0-9])n+(\\s|\\W)*(i|1|!|\\*|\\.|x)+h*(\\s|\\W)*(g+(\\s|\\W)*)+(e|3)+(\\s|\\W)*r+(\\s|\\W)*",
	"(\\b|[^a-z0-9])n+(\\s|\\W)*(i|1|!|\\*|\\.|x)+h*(\\s|\\W)*(g+(\\s|\\W)*)+(a|4|@)+(\\s|\\W)*r+(\\s|\\W)*",
	"(\\b|[^a-z0-9])n+(\\s|\\W)*(i|1|!|\\*|\\.|x)+h*(\\s|\\W)*(g+(\\s|\\W)*)+(i|1|!)+(\\s|\\W)*r+(\\s|\\W)*",
	"(\\b|[^a-z0-9])n+(\\s|\\W)*(i|1|!|\\*|\\.|x)+h*(\\s|\\W)*(g+(\\s|\\W)*)+(o|0)+(\\s|\\W)*r+(\\s|\\W)*",
	"(\\b|[^a-z0-9])n+(\\s|\\W)*(i|1|!|\\*|\\.|x)+h*(\\s|\\W)*(g+(\\s|\\W)*)+u+(\\s|\\W)*r+(\\s|\\W)*",
	"(\\b|[^a-z0-9])n+(\\s|\\W)*(i|1|!)+(\\s|\\W)*(g+(\\s|\\W)*)+",

	// Censor permutations of a slur for people from Pakistan unless the word is Pakistan.
	"(\\b|[^a-z0-9])p+((\\s|\\W)*(a|4|@))+((\\s|\\W)*h*)*((\\s|\\W)*k)+((\\s|\\W)*(i|l|1))+s*[^t]*[^a]*[^n]*\\b",

	// Censor permutations of "KKK" and related terms.
	"(\\b|[^a-z0-9])k(\\s|\\W)*k(\\s|\\W)*k\\b",
	"((\\s|\\W)*(k|c))+((\\s|\\W)*u)+((\\s|\\W)*(k|c))+((\\s|\\W)*(l|i|1|!))+((\\s|\\W)*u)+((\\s|\\W)*x)+\\w*",
	"((\\s|\\W)*k)+((\\s|\\W)*(l|1|!))+((\\s|\\W)*(a|4|@))+((\\s|\\W)*n)+\\w*",

	// Censor permutations of homophobic slurs.
	"f+((\\s|\\W)*(a|4|@))+((\\s|\\W)*g)+",
	"d+((\\s|\\W)*y)+((\\s|\\W)*k)+((\\s|\\W)*(e|3))+",

	// Censor permutations of transphobic slurs.
	"(t|7)+((\\s|\\W)*r)+((\\s|\\W)*(a|4|@))+((\\s|\\W)*n)+((\\s|\\W)*(y|ie|i))+",
	"(t|7)+((\\s|\\W)*r)+((\\s|\\W)*(o|0))+((\\s|\\W)*(o|0))+((\\s|\\W)*n)+",
	"(s|5|\\$)+((\\s|\\W)*h)+((\\s|\\W)*(e|3))+((\\s|\\W)*m)+((\\s|\\W)*(a|4|@))+((\\s|\\W)*(l|i|1))+((\\s|\\W)*(e|3))+",

	// Censor permutations of ableist slurs.
	"m+((\\s|\\W)*(i|l|1|!))+((\\s|\\W)*d)+((\\s|\\W)*g)+((\\s|\\W)*(e|3))+((\\s|\\W)*t)+",
	"r+((\\s|\\W)*(e|3))+((\\s|\\W)*(t|7))+((\\s|\\W)*(a|4|@))+((\\s|\\W)*r)+((\\s|\\W)*d)+",
];


export default slurFilter;
