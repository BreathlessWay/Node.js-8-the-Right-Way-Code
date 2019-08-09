'use strict';

const app = require('express')(),
	morgan = require('morgan'),
	nconf = require('nconf'),
	pkg = require('../../package');

// 参数变量>环境变量>配置文件变量
nconf.argv().env('__');
nconf.defaults({conf: `${__dirname}/config.json`});
nconf.file(nconf.get('conf'));

app.use(morgan('dev'));

require('./lib/search')(app, nconf.get('es'));

require('./lib/bundle')(app, nconf.get('es'));

app.get('/api/version', (req, res) => res.status(200).send(pkg.version));

app.listen(nconf.get('port'), () => console.log(`Server is working on http://${nconf.get('es:host')}:${nconf.get('port')}`));
