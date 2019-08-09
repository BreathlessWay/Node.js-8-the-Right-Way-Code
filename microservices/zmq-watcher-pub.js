'use strict';

const {watch} = require('fs');
const {socket} = require('zeromq');
const [, , filename] = process.argv;

if (!filename) {
	throw new Error(`filename must be specified`);
}

const publisher = socket('pub');

watch(filename, () => {
	publisher.send(JSON.stringify({
		type: 'changed',
		file: filename,
		timestamp: Date.now()
	}));
});

publisher.bind('tcp://*:60400', err => {
	if (err) {
		throw err;
	}
	console.log('Listening for zmq subscribers...');
});
