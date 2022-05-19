import React, { Component } from "react";
import { connect } from "react-redux";

import RoomActions from "./general/actionCreators";

import { AnyObject } from "../../common/util/types";


type ClientListProps = AnyObject;

class ClientList extends Component<ClientListProps>
{
	render ()
	{
		const { props } = this;
		const { clients = [] } = props;

		return (
			<div style={{ padding: "1em" }}>
				<label><small>Players:</small></label>

				<div className="client-list">
				{
					clients.map (( client, index ) =>
					{
						return <span
							className={index < clients.length - 1 ? "client-list-item" : "client-list-item-last"}
							key={`ClientList-span-${index}`}
						>
						{
							props.clientID !== props.ownerID || client.id === props.ownerID
								? ""
								: <span className="client-list-kick" onClick={() => props.kickClient (client.id)}>
									x
								</span>
						}

							{client.name}
						</span>;
					})
				}
				</div>
			</div>
		);
	}
};

const mapStateToProps = state =>
{
	const { general } = state.room;
	const { clients } = general;

	return {
		clients: Object.keys (clients).map (clientID => clients[clientID]),
		clientID: state.app.clientID,
		ownerID: general.info.ownerID,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		kickClient ( clientID: string )
		{
			dispatch (RoomActions.kickClientRequest (clientID));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (ClientList);
