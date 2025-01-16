export enum FieldType
{
	String,
	Number,
};

export enum FieldValidationResult
{
	Success,
	Type,
	Min,
	Max,
	Required,
};

export abstract class Field<T>
{
	#type: FieldType;
	#label: string;
	#min: number;
	#max: number;
	#default: T | null;

	constructor(type: FieldType, label: string, min: number, max: number, defaultValue: T | null = null)
	{
		this.#type = type;
		this.#label = label;
		this.#min = min;
		this.#max = max;
		this.#default = defaultValue;
	}

	public get type(): FieldType { return this.#type; }
	public get label(): string { return this.#label; }
	public get min(): number { return this.#min; }
	public get max(): number { return this.#max; }
	public get default(): T | null { return this.#default; }
	public get hasDefault(): boolean { return this.#default !== null; }

	protected abstract _validateType(value: any): boolean;
	protected abstract _validateMin(value: any): boolean;
	protected abstract _validateMax(value: any): boolean;

	public validate(value: any): FieldValidationResult
	{
		if (!this._validateType(value))
		{
			return FieldValidationResult.Type;
		}

		if (!this._validateMin(value))
		{
			return FieldValidationResult.Min;
		}

		if (!this._validateMax(value))
		{
			return FieldValidationResult.Max;
		}

		return FieldValidationResult.Success;
	}
};

export class NumberField extends Field<number | null>
{
	constructor(label: string, min: number, max: number, defaultValue: number | null = null)
	{
		super(FieldType.Number, label, min, max, defaultValue);
	}

	protected override _validateType(value: any): boolean
	{
		return typeof(value) === "number";
	}

	protected override _validateMin(value: number): boolean
	{
		return value >= this.min;
	}

	protected override _validateMax(value: number): boolean
	{
		return value <= this.max;
	}
};

export class StringField extends Field<string | null>
{
	constructor(label: string, min: number, max: number, defaultValue: string | null = null)
	{
		super(FieldType.String, label, min, max, defaultValue);
	}

	protected override _validateType(value: any): boolean
	{
		return typeof(value) === "string";
	}

	protected override _validateMin(value: string): boolean
	{
		return value.length >= this.min;
	}

	protected override _validateMax(value: string): boolean
	{
		return value.length <= this.max;
	}
};
