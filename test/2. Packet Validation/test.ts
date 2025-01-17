import { InvalidTest } from "./Invalid";
import { ClientIDTest } from "./ClientID";
import { CreateRoomTest } from "./CreateRoom";

describe("Packet Validation", function()
{
	it("should pack and unpack `Invalid` packets properly", InvalidTest);
	it("should pack and unpack `ClientID` packets properly", ClientIDTest);
	it("should pack and unpack `CreateRoom` packets properly", CreateRoomTest);
});
