import React, { Component } from "react";
import { connect } from "react-redux";

import copy from "copy-to-clipboard";

import RoomActions from "./general/actionCreators";

import { AnyObject } from "../../common/util/types";


type TopbarProps = AnyObject;
type TopbarLocalState = AnyObject;

class Topbar extends Component<TopbarProps, TopbarLocalState>
{
	constructor ( props )
	{
		super (props);

		this.state =
		{
			showID: false,
			copiedID: false,
		};
	}

	clickCopy ( id: string )
	{
		copy (id);

		this.setState ({ copiedID: true });
		setTimeout (() => this.setState ({ copiedID: false }), 750);
	}

	clickID ()
	{
		this.setState ({ showID: !this.state.showID });
	}

	render ()
	{
		const { props, state } = this;
		const { info } = props;

		const roomIDStyle: AnyObject =
		{
			fontFamily: "monospace",
			cursor: "pointer",
		};

		if ( state.showID )
		{
			roomIDStyle.userSelect = "text";
		}

		return (
			<div className="topbar">
				<button className="dashed btn orange" onClick={() => props.clickBack ()}>
					{"<< Leave Room"}
				</button>

				<span className="topbar-item">Time Left: {info.timeLeft}</span>
				<span className="topbar-item">Round: {info.currentRound} of {info.maxRounds}</span>

				<span className="topbar-item">
					<strong>ID: </strong>

					<span style={roomIDStyle} onClick={() => this.clickID ()}>
						{state.showID ? info.id : info.id?.replace (/./g, "•")}
					</span>

					<span style={{ padding: "0.5em" }}>
						<button
							className={`dashed btn orange ${state.copiedID ? "disabled" : ""}`}
							onClick={() => this.clickCopy (info.id)}
							disabled={state.copiedID}
						>
							{state.copiedID ? "Copied" : "Copy"}
						</button>
					</span>
				</span>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		info: state.room.general.info,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		clickBack ()
		{
			dispatch (RoomActions.leaveRoom ());
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (Topbar);
