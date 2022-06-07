const path = require ("path");
const webpack = require ("webpack");

const TerserPlugin = require ("terser-webpack-plugin");


const CLIENT_DIR = path.resolve (__dirname, "src/client");
const COMMON_DIR = path.resolve (__dirname, "src/common");


module.exports = ( env, argv ) =>
{
	const mode = argv.mode || "development";
	const isDev = mode === "development";

	console.log (`Running Webpack in '${mode}' mode`);

	return {
		mode,

		entry: `${CLIENT_DIR}/main.tsx`,
		devtool: isDev ? "inline-source-map" : undefined,

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

		optimization:
		{
			minimize: !isDev,
			minimizer:
			[
				new TerserPlugin (
				{
					terserOptions:
					{
						compress: true,
						sourceMap: false,
					},
				}),
			],
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
