'use strict';

const webpack = require('webpack'),
	path = require('path'),
	distDir = path.resolve(__dirname, '../dist'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: path.resolve(__dirname, '../app/index.ts'),
	output: {
		filename: 'bundle.js',
		path: distDir
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader'
			},
			{
				test: /\.css$/,
				use: [{
					loader: MiniCssExtractPlugin.loader,
					options: {
						hmr: process.env.NODE_ENV === 'development',
					},
				}, 'css-loader']
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100000
						}
					}
				]
			}
		]
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, '../../node_modules'),
			handlebars: path.resolve(__dirname, '../../node_modules/handlebars/dist/handlebars.min.js')
		},
		extensions: ['.js', '.json', '.ts']
	},
	devServer: {
		contentBase: distDir,
		port: 60800,
		disableHostCheck: true,
		proxy: {
			'/api': 'http://localhost:60702',
			'/es': {
				target: 'http://localhost:9200',
				pathRewrite: {
					'^/es': ''
				}
			}
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Better Book Bundle Builder'
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			JQuery: 'jquery'
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: '[name].css',
			chunkFilename: '[id].css',
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		}),
	]
};
