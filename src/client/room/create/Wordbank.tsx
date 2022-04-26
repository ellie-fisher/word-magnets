import React, { FC, ReactElement } from "react";
import { AnyObject } from "../../../common/util/types";


type WordbankProps = AnyObject;

const Wordbank: FC<WordbankProps> = ({ wordbank, isName = false, onClick = () => {} }): ReactElement =>
{
	return (
		<div>
			<h3>{wordbank.displayName}</h3>

			{
				wordbank.words.map (( word, index ) =>
				{
					return <button
						key={`wordbank-${wordbank.displayName}-word-${word}-${index}`}
						onClick={() => onClick (word, index)}
					>
						{isName ? word.name : word}
					</button>;
				})
			}
		</div>
	);
};


export default Wordbank;
