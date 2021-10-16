const path = require ("path");
const webpack = require ("webpack");


const CLIENT_DIR = path.resolve (__dirname, "src/client");
const COMMON_DIR = path.resolve (__dirname, "src/common");


module.exports = ( env, argv ) =>
{
	return {
		entry: `${CLIENT_DIR}/main.ts`,
		mode: argv.mode || "development",
		devtool: "inline-source-map",

		module:
		{
			rules:
			[
				{
					test: /\.ts$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},

		resolve:
		{
			extensions: [".ts", ".js"],
		},

		output:
		{
			filename: "bundle.js",
			path: path.resolve (__dirname, "dist/client/js"),
		},
	};
};
