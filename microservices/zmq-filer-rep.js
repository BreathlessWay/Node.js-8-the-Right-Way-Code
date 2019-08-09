'use strict';

const {readFile} = require('fs');
const {socket} = require('zeromq');

const responder = socket('rep');

responder.on('message', data => {
	const request = JSON.parse(data);
	console.log(`Received request to get: ${request.path}`);

	readFile(request.path, (err, content) => {
		if (err) {
			responder.send(JSON.stringify({
				error: err
			}));
			return;
		}
		console.log('Sending response content');
		responder.send(JSON.stringify({
			content: content.toString(),
			timestamp: Date.now(),
			pid: process.pid,
			error: null
		}));
	});
});

responder.bind('tcp://127.0.0.1:60401', err => {
	if (err) {
		throw err;
	}
	console.log('Listening for zmq requester...');
});
// Unix系统信号，表示系统收到用户的关闭指令
process.on('SIGINT', () => {
	console.log('Shutting down...');
	responder.close();
});

process.on('uncaughtException', () => {
	console.log('Shutting down...');
	responder.close();
});
