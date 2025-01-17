import { InvalidTest } from "./Invalid";

describe("Packet Validation", function()
{
	describe("Invalid", function()
	{
		it("should pack and unpack `Invalid` packets properly", InvalidTest);
	});
});
