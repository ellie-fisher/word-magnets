import { InvalidTest } from "./Invalid";
import { ClientIDTest } from "./ClientID";

describe("Packet Validation", function()
{
	it("should pack and unpack `Invalid` packets properly", InvalidTest);
	it("should pack and unpack `ClientID` packets properly", ClientIDTest);
});
