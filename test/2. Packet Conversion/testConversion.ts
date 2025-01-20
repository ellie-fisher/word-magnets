import { deepStrictEqual, notEqual } from "node:assert";

import { Packet } from "../../src/common/packets/Packet";
import { RawPacket } from "../../src/common/packets/types";
import { AnyObject } from "../../src/common/util";

export function testConversion(type: string, raw: RawPacket, template: AnyObject, defaultValues: AnyObject | null = null)
{
	it(`should pack and unpack \`${type}\` packets properly`, function()
	{
		const backup = [...raw];
		const packet = Packet.fromArray(raw);

		deepStrictEqual(Packet.toArray(raw[0], packet), raw);

		/* Make sure `raw` isn't modified. */
		deepStrictEqual(backup, raw);
		notEqual(Packet.toArray(raw[0], packet), raw);

		// Test field values against `template`.
		deepStrictEqual(packet, template);

		if (defaultValues !== null)
		{
			deepStrictEqual(Packet.fromArray([raw[0]]), defaultValues);
		}
	});
};
