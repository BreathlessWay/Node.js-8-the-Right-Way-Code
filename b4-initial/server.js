'use strict';

const express = require('express'),
	app = express(),
	pkg = require('../package'),
	path = require('path'),
	{URL} = require('url'),
	nconf = require('nconf'),
	expressSession = require('express-session'),
	passport = require('passport'),
	GitHubStrategy = require('passport-github').Strategy;

nconf.argv().env('__').defaults({'NODE_ENV': 'development'});

const NODE_ENV = nconf.get('NODE_ENV'),
	isDev = NODE_ENV === 'development';

nconf.defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)}).file(nconf.get('conf'));

const serviceUrl = new URL(nconf.get('serviceUrl')),
	servicePort = serviceUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);

const morgan = require('morgan');

app.use(morgan('dev'));

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

passport.serializeUser((profile, done) => {
	done(null, {
		id: profile.id,
		provider: profile.provider
	});
});

passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());

app.use(passport.session());

passport.use(new GitHubStrategy({
		clientID: nconf.get('auth:github:clientID'),
		clientSecret: nconf.get('auth:github:clientSecret'),
		callbackURL: new URL('/auth/github/callback', serviceUrl).href
	},
	(accessToken, refreshToken, profile, done) => done(null, profile)
));

app.get('/auth/github',
	passport.authenticate('github'));

app.get('/auth/github/callback',
	passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/'
	}));

app.get('/api/session', (req, res) => {
	const session = {auth: req.isAuthenticated()};
	res.status(200).json(session);
});

app.get('/auth/signout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.get('/api/version', (req, res) => {
	res.status(200).json(pkg.version);
});

app.listen(servicePort, () => console.log('Ready'));
