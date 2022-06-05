import React, { Component } from "react";
import { connect } from "react-redux";

import AppActions from "../app/actionCreators";
import AppView from "../app/AppView";

import { AnyObject } from "../../common/util/types";


type MessageProps = AnyObject;

class Message extends Component<MessageProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div className="center columns">
				<h1>{props.title}</h1>
				<p>{props.body}</p>

				<button className="magnet" onClick={props.clickOK}>
					OK
				</button>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return { ...state.mainMenu.message };
};

const mapDispatchToProps = dispatch =>
{
	return {
		clickOK ()
		{
			dispatch (AppActions.setView (AppView.MainMenu));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (Message);
