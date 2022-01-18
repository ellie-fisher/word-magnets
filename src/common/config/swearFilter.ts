/**
 * Regex hieroglyphics.
 *
 * This is the optional swear filter for sentences and player names.
 *
 * These generally account for spaces, repeat characters, characters that look similar (i, l, 1, !, etc.),
 * and so on. Many have special rules and exceptions but this is generally how they work.
 *
 * If you want to see what they do, put them in RegExr -- I could not have made these without it.
 *
 * I have no doubt people will be able to bypass this. People are very creative at getting around
 * word filters. This is just to provide some deterrence and prevent certain words from appearing
 * in the wordbanks.
 */

const swearFilter =
[
		// Censor permutations of "asshole".
		"(a|4|\\@)+(\\s|\\W)*s(\\s|\\W)*s+(\\s|\\W)*h+(\\s|\\W)*(o|0)+(\\s|\\W)*(e|3)*((l|i|1|!)+)(e|3)*",

		// Censor permutations of "bastard".
		"b+((\\s|\\W)*(a|4|@))+((\\s|\\W)*(s|z|5))+((\\s|\\W)*t)+((\\s|\\W)*(a|4|@|e|3))+((\\s|\\W)*r)+((\\s|\\W)*d)+",

		// Censor permutations of "bitch".
		"b+((\\s|\\W)*(i|l|y|1|!))+(\\s|\\W)*t+(\\s|\\W)*c+(\\s|\\W)*h+",

		// Censor permutations of "prick".
		"(\\b|[^a-z])p+((\\s|\\W)*r)+((\\s|\\W)*(i|l|1|!))+(\\s|\\W)*c+((\\s|\\W)*k)+",

		// Censor permutations of "twat".
		"t+((\\s|\\W)*w)+((\\s|\\W)*(a|4|@))+((\\s|\\W)*t)+((\\s|\\W)*(s|z|\\d))*\\b",

		// Censor permutations of "dick".
		"d+((\\s|\\W)*(i|l|1))+((\\s|\\W)*c)+((\\s|\\W)*k)+",

		// Censor permutations of "pussy".
		"p+((\\s|\\W)*u)+((\\s|\\W)*(s|5|\\$))+(\\s|\\W)*y+",

		// Censor permutations of "cock".
		"(\\b|[^a-z])c+((\\s|\\W)*(o|0))+((\\s|\\W)*c)+((\\s|\\W)*k)+(s|z|\\d)*\\b",

		// Censor permutations of "cunt".
		"(c|k)+((\\s|\\W)*u)+((\\s|\\W)*n)+(\\s|\\W)*t+",

		// Censor permutations of "shit".
		"(s|5|\\$)+((\\s|\\W)*h)+((\\s|\\W)*i)+((\\s|\\W)*t)+",
		"(\\b|[^a-z])(s|5|\\$)+((\\s|\\W)*h)+((\\s|\\W)*(i|l|a|y|1|!))+((\\s|\\W)*t)+",

		// Censor permutations of "fuck", "fuk", etc.
		"f+((\\s|\\W)*u)+((\\s|\\W)*(c|k))+((\\s|\\W)*(c|k))+",

		// Censor permutations of "goddamn".
		"g+((\\s|\\W)*(o|0))+((\\s|\\W)*d)+((\\s|\\W)*(a|4|@))+((\\s|\\W)*m)+n*",

		// Censor permutations of "whore".
		"(\\b|[^a-z])w+((\\s|\\W)*h)+((\\s|\\W)*(o|0))+((\\s|\\W)*r)+(e|3)+",
		"(\\b|[^a-z])w+((\\s|\\W)*h)+((\\s|\\W)*(o|0))+((\\s|\\W)*r)+(\\b|s|z|y|(in.?))+",
];


export default swearFilter;
