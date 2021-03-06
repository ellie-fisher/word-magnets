import React, { FC, ReactElement } from "react";
import { AnyObject } from "../../../common/util/types";


type WordbankProps = AnyObject;

const Wordbank: FC<WordbankProps> = ( props: WordbankProps ): ReactElement =>
{
	const { wordbank, disabled = false, isName = false, onClick = () => {} } = props;

	return (
		<div className="dashed padded margin-v">
		{
			wordbank.words.map (( word, index ) =>
			{
				let wordValue = isName ? word.name : word;

				// Make spaces empty so the `:empty` selector gets activated.
				if ( wordValue === " " )
				{
					wordValue = "";
				}

				return <button
					key={`wordbank-${wordbank.displayName}-word-${word}-${index}`}
					className="magnet small"
					onClick={() => onClick (word, index)}
					disabled={disabled}
				>
					{wordValue}
				</button>;
			})
		}
		</div>
	);
};


export default Wordbank;
