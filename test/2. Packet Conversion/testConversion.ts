import { deepStrictEqual } from "node:assert";

import { Packet } from "../../src/common/packets/Packet";
import { AnyObject } from "../../src/common/util";
import { PacketBuffer, PacketField } from "../../src/common/packets/PacketBuffer";
import { PacketType } from "../../src/common/packets/PacketType";

export interface TestConversionArg
{
	raw: [PacketType, ...PacketField[]];
	template: AnyObject;
	defaultValues?: PacketField[];
	test?: (..._) => void;
};

export function testConversion(type: string, ...args: TestConversionArg[])
{
	it(`should pack and unpack \`${type}\` packets properly`, function()
	{
		args.forEach(({ raw, template, defaultValues = [], test = () => {} }) =>
		{
			const buffer = PacketBuffer.from(...raw);
			const unpacked = Packet.unpack(buffer);

			buffer.rewind();

			raw.forEach(value => deepStrictEqual(buffer.read(typeof(value)), value));

			// Test field values against `template`.
			deepStrictEqual(unpacked, template);

			if (defaultValues.length > 0)
			{
				const defaultBuffer = Packet.pack(raw[0], {});

				deepStrictEqual(defaultBuffer.readU8(), raw[0]);
				deepStrictEqual(defaultBuffer.length, defaultValues.length + 1);

				defaultValues.forEach(value => deepStrictEqual(defaultBuffer.read(typeof(value)), value));
			}

			test(type, raw, template);
		})
	});
};
