import { deepStrictEqual, notEqual } from "node:assert";

import { Packet } from "../../src/common/packets/Packet";
import { RawPacket } from "../../src/common/packets/types";
import { AnyObject } from "../../src/common/util";

export interface TestConversionArg
{
	raw: RawPacket;
	template: AnyObject;
	defaultValues?: AnyObject | null;
	test?: (..._) => void;
};

export function testConversion(type: string, ...args: TestConversionArg[])
{
	it(`should pack and unpack \`${type}\` packets properly`, function()
	{
		args.forEach(({ raw, template, defaultValues = null, test = () => {} }) =>
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

			test(type, raw, template, defaultValues);
		})
	});
};
