'use strict';

const {createServer} = require('net');

const server = createServer(connection => {
	console.log('Subscriber connected.');

	const firstChunk = `{"type":"changed", "timesta`,
		secondChunk = `mp": 1564478172011}\n`;

	connection.write(firstChunk);

	const timer = setTimeout(() => {
		connection.write(secondChunk);
		connection.end();
	}, 10000);

	connection.on('end', () => {
		clearTimeout(timer);
		console.log('Subscriber disconnected.');
	});
});

server.listen(60300, () => console.log('Test server listening for subscribers...'));
