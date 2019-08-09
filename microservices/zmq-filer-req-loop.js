'use strict';

const {socket} = require('zeromq');
const [, , filename] = process.argv;

const requester = socket('req');

requester.on('message', data => {
	const response = JSON.parse(data);
	console.log(`Received response:`, response);
});

requester.connect('tcp://127.0.0.1:60401');

for (let i = 0; i <= 5; i++) {
	console.log(`Sending ${i} request for ${filename}`);
	requester.send(JSON.stringify({path: filename}));
}
