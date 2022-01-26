import React, { Component } from "react";
import { connect } from "react-redux";

import AppView from "./AppView";


interface AppProps
{
	view: AppView;
};

class App extends Component<AppProps>
{
	render ()
	{
		return <div>View: {this.props.view}</div>;
	}
}

const mapStateToProps = state =>
{
	return {
		view: state.app.view,
	};
};


export default connect (mapStateToProps) (App);
