'use strict';

const express = require('express'),
	app = express(),
	pkg = require('../package'),
	path = require('path'),
	{URL} = require('url'),
	nconf = require('nconf'),
	expressSession = require('express-session');

nconf.argv().env('__').defaults({'NODE_ENV': 'development'});

const NODE_ENV = nconf.get('NODE_ENV'),
	isDev = NODE_ENV === 'development';

nconf.defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)}).file(nconf.get('conf'));

const serviceUrl = new URL(nconf.get('serviceUrl')),
	servicePort = serviceUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);

const morgan = require('morgan');

app.use(morgan('dev'));

app.get('/api/version', (req, res) => {
	res.status(200).json(pkg.version);
});

if (isDev) {
	const webpack = require('webpack'),
		webpackMiddleware = require('webpack-dev-middleware'),
		webpackConfig = require('./config/webpack.config'),
		compiler = webpack(webpackConfig),
		FileStore = require('session-file-store')(expressSession);

	app.use(expressSession({
		// 在每次请求时都执行报错会话的操作
		resave: true,
		// 是否保存新的但未修改的会话
		saveUninitialized: true,
		// 加密字段
		secret: 'unguessable',
		// 会话数据缓存
		store: new FileStore
	}));

	app.use(webpackMiddleware(compiler, {
		publicPath: '/',
		stats: {
			color: true
		}
	}));

} else {
	app.use(express.static('dist'));
}

app.listen(servicePort, () => console.log('Ready'));
