'use strict';

const {readFiles} = require('node-dir');
const parseRDF = require('./lib/parse-rdf');

const [, , dirname] = process.argv;

const options = {
	match: /\.rdf$/,
	exclude: ['pg0.rdf']
};

readFiles(dirname, options, (err, content, next) => {
	if (err) throw err;

	const doc = parseRDF(content);

	console.log(JSON.stringify({index: {_id: `pg${doc.id}`}}));

	console.log(JSON.stringify(doc));

	next();
});

process.stdout.on('error', err => {
	if (err.code === 'EPIPE') {
		process.exit();
	}
	throw err;
});
