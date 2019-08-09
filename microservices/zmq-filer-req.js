'use strict';

const {socket} = require('zeromq');
const [, , filename] = process.argv;

const requester = socket('req');

requester.on('message', data => {
	const response = JSON.parse(data);
	if (response && response.error) {
		console.log({err: response.error});
		return;
	}
	console.log(`Received response:`, response);
});

requester.connect('tcp://127.0.0.1:60401');

console.log(`Sending a request for ${filename}`);
requester.send(JSON.stringify({path: filename}));
