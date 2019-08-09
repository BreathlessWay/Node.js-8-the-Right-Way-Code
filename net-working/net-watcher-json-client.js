'use strict';

const {connect} = require('net');

const client = connect({port: 60300});

client.on('data', data => {
	const message = JSON.parse(data);
	if (message.type === 'watching') {
		console.log(`Now watching: ${message.file}`);
		return;
	}
	if (message.type === 'changed') {
		const date = new Date(message.timestamp);
		console.log(`File changed: ${date}`);
		return;
	}

	console.log(`Unrecognized message type: ${message.type}`);
});
