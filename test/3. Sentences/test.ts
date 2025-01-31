import { deepStrictEqual } from "node:assert";

import { Sentence } from "../../src/common/words/Sentence";
import { Wordbank } from "../../src/common/words/Wordbank";

describe("Sentences", function()
{
	const wordbanks =
	[
		new Wordbank(["green", "purple", "pretty", "ugly", "good", "bad", "nice", "mean", "cute"]),
		new Wordbank(["cat", "dog", "frog", "person", "house", "music"]),
		new Wordbank(["walk", "talk", "say", "move", "see", "listen", "fall", "love"]),
		new Wordbank(["be", "is", "are", "were", "am", "will", "I", "she", "he", "they", "it", "do", "the", "a", "an", "to", "yes", "no", " ", "anti-", "-e", "-d", "-r", "-s", "-t", "-y", "-", "-'", "-.", "-,", "-!"]),
	];

	// Banks
	const ADJ = 0;
	const NOUN = 1;
	const VERB = 2;
	const MISC = 3;

	// Words
	const THE = [MISC, wordbanks[MISC].indexOf("the")];
	const CAT = [NOUN, wordbanks[NOUN].indexOf("cat")];
	const DOG = [NOUN, wordbanks[NOUN].indexOf("dog")];
	const HOUSE = [NOUN, wordbanks[NOUN].indexOf("house")];
	const I = [MISC, wordbanks[MISC].indexOf("I")];
	const LOVE = [VERB, wordbanks[VERB].indexOf("love")];
	const AM = [MISC, wordbanks[MISC].indexOf("am")];
	const ARE = [MISC, wordbanks[MISC].indexOf("are")];
	const CUTE = [ADJ, wordbanks[ADJ].indexOf("cute")];
	const WALK = [VERB, wordbanks[VERB].indexOf("walk")];
	const HE = [MISC, wordbanks[MISC].indexOf("he")];
	const THEY = [MISC, wordbanks[MISC].indexOf("they")];
	const TO = [MISC, wordbanks[MISC].indexOf("to")];
	const NO = [MISC, wordbanks[MISC].indexOf("no")];
	const _SPC_ = [MISC, wordbanks[MISC].indexOf(" ")];
	const _E = [MISC, wordbanks[MISC].indexOf("-e")];
	const _D = [MISC, wordbanks[MISC].indexOf("-d")];
	const _R = [MISC, wordbanks[MISC].indexOf("-r")];
	const _S = [MISC, wordbanks[MISC].indexOf("-s")];
	const _T = [MISC, wordbanks[MISC].indexOf("-t")];
	const _DOT = [MISC, wordbanks[MISC].indexOf("-.")];
	const _EXCLAIM = [MISC, wordbanks[MISC].indexOf("-!")];
	const _ = [MISC, wordbanks[MISC].indexOf("-")];
	const ANTI_ = [MISC, wordbanks[MISC].indexOf("anti-")];

	describe("`Sentence.toString()`", function()
	{
		it("should convert valid sentences to strings properly", function()
		{
			deepStrictEqual(Sentence.toString([THE, CAT, WALK, _E, _D, TO, HE, _R, HOUSE] as any, wordbanks), "the cat walked to her house");
			deepStrictEqual(Sentence.toString([THE, CAT, WALK, _E, _D, TO, HE, _SPC_, _R, HOUSE] as any, wordbanks), "the cat walked to he r house");
			deepStrictEqual(Sentence.toString([THE, _SPC_, CAT] as any, wordbanks), "the  cat");
			deepStrictEqual(Sentence.toString([THE, _SPC_, _SPC_, CAT] as any, wordbanks), "the   cat");
			deepStrictEqual(Sentence.toString([THE, _SPC_, _SPC_, _SPC_, CAT] as any, wordbanks), "the    cat");
			deepStrictEqual(Sentence.toString([THE, _SPC_, _SPC_, _SPC_, CAT] as any, wordbanks), "the    cat");
			deepStrictEqual(Sentence.toString([I, LOVE, CAT, _S, _DOT, _DOT, _DOT, THEY, ARE, CUTE, _EXCLAIM] as any, wordbanks), "I love cats... they are cute!");
			deepStrictEqual(Sentence.toString([I, AM, NO, _T, ANTI_, DOG, _EXCLAIM] as any, wordbanks), "I am not antidog!");
			deepStrictEqual(Sentence.toString([CAT, _, DOG] as any, wordbanks), "catdog");
		});

		it("should return a blank string if there are any invalid indices", function()
		{
			deepStrictEqual(Sentence.toString([CAT, _S, ARE, [-1, 3]] as any, wordbanks), "");
			deepStrictEqual(Sentence.toString([CAT, _S, ARE, [ADJ, -1]] as any, wordbanks), "");
			deepStrictEqual(Sentence.toString([I, AM, [wordbanks.length, 0]] as any, wordbanks), "");
			deepStrictEqual(Sentence.toString([I, AM, [MISC, wordbanks[MISC].words.length]] as any, wordbanks), "");
			deepStrictEqual(Sentence.toString([I, AM, [0, 0]] as any, wordbanks), "I am green");
		});

		it("should return a blank string if the sentence ends up being too long", function()
		{
			const loveCats = [I, LOVE, CAT, _S, _DOT, _DOT, _DOT, THEY, ARE, CUTE];

			for (let i = 0; i < Sentence.MAX_LENGTH - "I love cats... they are cute".length; i++)
			{
				loveCats.push(_EXCLAIM);
			}

			deepStrictEqual(Sentence.toString(loveCats as any, wordbanks), "I love cats... they are cute!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			loveCats.push(_EXCLAIM);
			deepStrictEqual(Sentence.toString(loveCats as any, wordbanks), "");

			const eeee = [];

			for (let i = 0; i < Sentence.MAX_LENGTH; i++)
			{
				eeee.push(_E);
			}

			deepStrictEqual(Sentence.toString(eeee as any, wordbanks), "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
			eeee.push(_E);
			deepStrictEqual(Sentence.toString(eeee as any, wordbanks), "");
		});

		it("should trim sentences with extra space at the beginning and end", function()
		{
			deepStrictEqual(Sentence.toString([_SPC_, _SPC_, _SPC_, _SPC_] as any, wordbanks), "");
			deepStrictEqual(Sentence.toString([_SPC_, _SPC_, _, _, _, _SPC_, _SPC_] as any, wordbanks), "");
			deepStrictEqual(Sentence.toString([_, _, _, _,] as any, wordbanks), "");
			deepStrictEqual(Sentence.toString([_SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_] as any, wordbanks), "cat");
			deepStrictEqual(Sentence.toString([_SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_] as any, wordbanks), "cat    cat    cat");
		});
	});
});
