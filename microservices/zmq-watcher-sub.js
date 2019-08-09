'use strict';

const {socket} = require('zeromq');

const subscriber = socket('sub');

subscriber.subscribe('');

subscriber.on('message', data => {
	const message = JSON.parse(data);

	const {file, timestamp} = message;
	console.log(message);
	console.log(`File "${file}" changed at ${new Date(timestamp).toLocaleString()}`);
});

subscriber.connect('tcp://localhost:60400');
