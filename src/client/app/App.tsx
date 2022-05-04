import React, { Component } from "react";
import { connect } from "react-redux";

import AppView from "./AppView";
import MainMenu from "../mainMenu/MainMenu";
import Room from "../room/Room";
import RoomDestroyed from "../mainMenu/RoomDestroyed";

import { AppState } from "./reducer";
import { AnyObject } from "../../common/util/types";

import "./packetHandlers";


type AppProps = AnyObject;

class App extends Component<AppProps>
{
	render ()
	{
		const { props } = this;

		let view;

		switch ( props.view )
		{
			case AppView.Connecting:
			{
				view = <div>Connecting...</div>;
				break;
			}

			case AppView.Error:
			{
				view =
				(
					<div>
						<h1>{props.error.header}</h1>
						<p>{props.error.message}</p>
					</div>
				);

				break;
			}

			case AppView.MainMenu:
			{
				view = <MainMenu />;
				break;
			}

			case AppView.Room:
			{
				view = <Room />;
				break;
			}

			case AppView.RoomDestroyed:
			{
				view = <RoomDestroyed />;
				break;
			}
		}

		return <div>{view}</div>;
	}
}

const mapStateToProps = state =>
{
	return {
		error: state.app.error,
		view: state.app.view,
	};
};


export default connect (mapStateToProps) (App);
