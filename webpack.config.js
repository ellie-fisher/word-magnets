const path = require ("path");
const webpack = require ("webpack");


const CLIENT_DIR = path.resolve (__dirname, "src/client");
const COMMON_DIR = path.resolve (__dirname, "src/common");


module.exports = ( env, argv ) =>
{
	const mode = argv.mode || "development";
	const isDev = mode === "development";

	return {
		mode,

		entry: `${CLIENT_DIR}/main.tsx`,
		devtool: "inline-source-map",

		module:
		{
			rules:
			[
				{
					test: /\.tsx?$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},

		resolve:
		{
			extensions: [".ts", ".js", ".tsx", ".jsx"],
		},

		watchOptions:
		{
			ignored: ["**/src/server"],
		},

		output:
		{
			filename: "bundle.js",
			path: path.resolve (__dirname, "dist/client/js"),
		},
	};
};
