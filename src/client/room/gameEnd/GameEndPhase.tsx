import React, { Component } from "react";
import { connect } from "react-redux";

import Table from "../Table";

import { AnyObject } from "../../../common/util/types";

import "./packetHandlers";


type GameEndProps = AnyObject;

class GameEnd extends Component<GameEndProps, AnyObject>
{
	render ()
	{
		const rows = this.props.scores.map (data => [data.name, data.score]);

		rows.sort (( a, b ) => b[1] - a[1]);

		return (
			<div style={{ width: "50%" }} className="center">
				<h1>Final Scores</h1>
			{
				rows.length <= 0
					? "No players to show, somehow...?"
					: <Table
						columns={["Player", "Score"]}
						rows={rows}
					/>
			}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return { scores: state.room.gameEnd.scores };
};


export default connect (mapStateToProps) (GameEnd);
