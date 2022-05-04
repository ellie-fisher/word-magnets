import React from "react";

import { AnyObject } from "../../common/util/types";


type ClientListProps = AnyObject;

const ClientList = ( props: ClientListProps ) =>
{
	const { clients, onClick = null } = props;

	if ( onClick === null )
	{
		return (
			<ul>
			{
				Object.keys (clients).map (( key, index ) =>
				{
					return <li key={`ClientList-li-${index}`}>{clients[key].name}</li>;
				})
			}
			</ul>
		);
	}

	return (
		<div>
		{
			Object.keys (clients).map (( key, index ) =>
			{
				const client = clients[key];

				return (
					<button key={`ClientList-button-${index}`} onClick={() => onClick (key)}>
						{client.name}
					</button>
				);
			})
		}
		</div>
	);
};


export default ClientList;
