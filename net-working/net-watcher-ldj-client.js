'use strict';

const netClient = require('net').connect({port: 60300});
const ldjClient = require('../lib/ldj-client').connect(netClient);

ldjClient.on('message', message => {
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
