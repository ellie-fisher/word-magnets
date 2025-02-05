import { deepStrictEqual } from "node:assert";

import { Sentence, SentenceConversionError } from "../../src/common/words/Sentence";

describe("Sentences", function()
{
	const wordbanks =
	[
		["green", "purple", "pretty", "ugly", "good", "bad", "nice", "mean", "cute"],
		["cat", "dog", "frog", "person", "house", "music"],
		["walk", "talk", "say", "move", "see", "listen", "fall", "love"],
		["be", "is", "are", "were", "am", "will", "I", "she", "he", "they", "it", "do", "the", "a", "an", "to", "yes", "no", " ", "anti-", "-e", "-d", "-r", "-s", "-t", "-y", "-", "-'", "-.", "-,", "-!"],
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

	describe("`Sentence.convertToString()`", function()
	{
		it("should convert valid sentences to strings properly", function()
		{
			deepStrictEqual(Sentence.convertToString([THE, CAT, WALK, _E, _D, TO, HE, _R, HOUSE] as any, wordbanks), [SentenceConversionError.None, "The cat walked to her house"]);
			deepStrictEqual(Sentence.convertToString([THE, CAT, WALK, _E, _D, TO, HE, _SPC_, _R, HOUSE] as any, wordbanks), [SentenceConversionError.None, "The cat walked to he r house"]);
			deepStrictEqual(Sentence.convertToString([THE, _SPC_, CAT] as any, wordbanks), [SentenceConversionError.None, "The  cat"]);
			deepStrictEqual(Sentence.convertToString([THE, _SPC_, _SPC_, CAT] as any, wordbanks), [SentenceConversionError.None, "The   cat"]);
			deepStrictEqual(Sentence.convertToString([THE, _SPC_, _SPC_, _SPC_, CAT] as any, wordbanks), [SentenceConversionError.None, "The    cat"]);
			deepStrictEqual(Sentence.convertToString([THE, _SPC_, _SPC_, _SPC_, CAT] as any, wordbanks), [SentenceConversionError.None, "The    cat"]);
			deepStrictEqual(Sentence.convertToString([I, LOVE, CAT, _S, _DOT, _DOT, _DOT, THEY, ARE, CUTE, _EXCLAIM] as any, wordbanks), [SentenceConversionError.None, "I love cats... they are cute!"]);
			deepStrictEqual(Sentence.convertToString([I, AM, NO, _T, ANTI_, DOG, _EXCLAIM] as any, wordbanks), [SentenceConversionError.None, "I am not antidog!"]);
			deepStrictEqual(Sentence.convertToString([CAT, _, DOG] as any, wordbanks), [SentenceConversionError.None, "Catdog"]);
		});

		it("should return a blank string if there are any invalid indices", function()
		{
			deepStrictEqual(Sentence.convertToString([CAT, _S, ARE, [-1, 3]] as any, wordbanks), [SentenceConversionError.Invalid, ""]);
			deepStrictEqual(Sentence.convertToString([CAT, _S, ARE, [ADJ, -1]] as any, wordbanks), [SentenceConversionError.Invalid, ""]);
			deepStrictEqual(Sentence.convertToString([I, AM, [wordbanks.length, 0]] as any, wordbanks), [SentenceConversionError.Invalid, ""]);
			deepStrictEqual(Sentence.convertToString([I, AM, [MISC, wordbanks[MISC].length]] as any, wordbanks), [SentenceConversionError.Invalid, ""]);
			deepStrictEqual(Sentence.convertToString([I, AM, [0, 0]] as any, wordbanks), [SentenceConversionError.None, "I am green"]);
		});

		it("should return an error if sentence is too short", function()
		{
			deepStrictEqual(Sentence.convertToString([] as any, wordbanks), [SentenceConversionError.TooShort, ""]);
			deepStrictEqual(Sentence.convertToString([_SPC_] as any, wordbanks), [SentenceConversionError.TooShort, ""]);
			deepStrictEqual(Sentence.convertToString([_SPC_, _SPC_, _SPC_, _SPC_, _SPC_] as any, wordbanks), [SentenceConversionError.TooShort, ""]);
		});

		it("should return an error if sentence is too long", function()
		{
			const loveCats = [I, LOVE, CAT, _S, _DOT, _DOT, _DOT, THEY, ARE, CUTE];

			for (let i = 0; i < Sentence.MAX_LENGTH - "I love cats... they are cute".length; i++)
			{
				loveCats.push(_EXCLAIM);
			}

			deepStrictEqual(Sentence.convertToString(loveCats as any, wordbanks), [SentenceConversionError.None, "I love cats... they are cute!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"]);
			loveCats.push(_EXCLAIM);
			deepStrictEqual(Sentence.convertToString(loveCats as any, wordbanks), [SentenceConversionError.TooLong, "I love cats... they are cute!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"]);

			const eeee = [];

			for (let i = 0; i < Sentence.MAX_LENGTH; i++)
			{
				eeee.push(_E);
			}

			deepStrictEqual(Sentence.convertToString(eeee as any, wordbanks), [SentenceConversionError.None, "Eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"]);
			eeee.push(_E);
			deepStrictEqual(Sentence.convertToString(eeee as any, wordbanks), [SentenceConversionError.TooLong, "Eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"]);
		});

		it("should trim sentences with extra space at the beginning and end", function()
		{
			deepStrictEqual(Sentence.convertToString([_SPC_, _SPC_, _SPC_, _SPC_] as any, wordbanks), [SentenceConversionError.TooShort, ""]);
			deepStrictEqual(Sentence.convertToString([_SPC_, _SPC_, _, _, _, _SPC_, _SPC_] as any, wordbanks), [SentenceConversionError.TooShort, ""]);
			deepStrictEqual(Sentence.convertToString([_, _, _, _,] as any, wordbanks), [SentenceConversionError.TooShort, ""]);
			deepStrictEqual(Sentence.convertToString([_SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_] as any, wordbanks), [SentenceConversionError.None, "Cat"]);
			deepStrictEqual(Sentence.convertToString([_SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_, CAT, _SPC_, _SPC_, _SPC_] as any, wordbanks), [SentenceConversionError.None, "Cat    cat    cat"]);
		});
	});
});
