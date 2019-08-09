'use strict';

const {watch} = require('fs');
const {createServer} = require('net');
const [, , filename] = process.argv;

if (!filename) {
	throw Error('Error: No filename specified!');
}

createServer(connection => {
	console.log('Subscribe connected.');

	connection.write(JSON.stringify({type: 'watching', file: filename}) + '\n');

	const watcher = watch(filename, () => {
		connection.write(JSON.stringify({type: 'changed', timestamp: Date.now()}) + '\n');
	});

	connection.on('close', () => {
		console.log('Subscribe disconnected.');
		watcher.close();
	});
}).listen(60300, () => console.log(`Listening for subscribers...`));

