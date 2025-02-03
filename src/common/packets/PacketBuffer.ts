import { clamp } from "../util";

export const MIN_U8_VALUE = 0;
export const MAX_U8_VALUE = 255;

export type PacketField = string | boolean | number;

const clampU8 = (value: number): number => clamp(Math.round(value), MIN_U8_VALUE, MAX_U8_VALUE);

/**
 * A class for reading and writing packet buffers.
 */
export class PacketBuffer
{
	static from(...values: (PacketField)[]): PacketBuffer
	{
		let size = 0;
		const { length } = values;

		/* Calculate buffer size. */

		for (let i = 0; i < length; i++)
		{
			size += PacketBuffer.sizeOf(values[i]);
		}

		/* Write values to buffer. */

		const buffer = new PacketBuffer(size);

		for (let i = 0; i < length; i++)
		{
			buffer.write(values[i]);
		}

		buffer.rewind();

		return buffer;
	}

	static sizeOf(value: PacketField): number
	{
		switch (typeof(value))
		{
			case "string": return clampU8(value.length) + 1; // String size + length that gets written.
			case "boolean": return 1;
			case "number": return 1;
			default: return 0;
		}
	}

	#array: Uint8ClampedArray;
	#index: number;

	constructor(size: number)
	{
		this.#array = new Uint8ClampedArray(size);
		this.#index = 0;
	}

	public get array(): Uint8ClampedArray { return this.#array; }
	public get buffer(): ArrayBuffer { return this.#array.buffer as ArrayBuffer; }
	public get index(): number { return this.#index; }
	public get length(): number { return this.#array.length; }
	public get isAtEnd(): boolean { return this.#index >= this.#array.length; }

	#isValidOffset(offset: number): boolean
	{
		const index = this.#index + offset;

		return Math.round(index) === index && index >= 0 && index < this.#array.length;
	}

	public rewind(): void
	{
		this.#index = 0;
	}

	public writeU8(value: number): boolean
	{
		const success = !this.isAtEnd && clampU8(value) === value;

		if (success)
		{
			this.#array[this.#index++] = value;
		}

		return success;
	}

	public writeBoolean(value: boolean): boolean
	{
		return this.writeU8(Number(value));
	}

	public writeString(str: string): boolean
	{
		const length = clampU8(str.length);
		let success = this.#isValidOffset(length) && this.writeU8(length);

		for (let i = 0; i < length && success; i++)
		{
			success &&= this.writeU8(str.charCodeAt(i));
		}

		return success;
	}

	public write(value: PacketField): boolean
	{
		switch (typeof(value))
		{
			case "string": return this.writeString(value);
			case "boolean": return this.writeBoolean(value);
			case "number": return this.writeU8(value);
			default: return false;
		}
	}

	public readU8(): number
	{
		return this.isAtEnd ? 0x00 : this.#array[this.#index++];
	}

	public readBoolean(): boolean
	{
		return !!this.readU8();
	}

	public readString(): string
	{
		let str = "";

		const length = this.readU8();

		for (let i = 0; i < length && !this.isAtEnd; i++)
		{
			str += String.fromCharCode(this.readU8());
		}

		return str;
	}

	public read(type: string): PacketField | null
	{
		switch (type)
		{
			case "string": return this.readString();
			case "boolean": return this.readBoolean();
			case "number": return this.readU8();
			default: return null;
		}
	}

	public peekU8(offset: number = 0): number
	{
		return this.#isValidOffset(offset) ? this.#array[this.#index] : 0x00;
	}
};
