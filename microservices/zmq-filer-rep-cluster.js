'use strict';

const cluster = require('cluster');
const {cpus} = require('os');
const {readFile} = require('fs');
const {socket} = require('zeromq');

const numWorkers = cpus().length;

if (cluster.isMaster) {

	// 并行的response socket
	const router = socket('router').bind('tcp://127.0.0.1:60401');
	// 并行的request socket
	const dealer = socket('dealer').bind('ipc://filer-dealer.ipc');

	router.on('message', (...frames) => dealer.send(frames));
	dealer.on('message', (...frames) => router.send(frames));

	// online事件触发时触发回调，接收worker参数有process属性，和Node.js中的process一样
	cluster.on('online', worker => console.log(`Worker ${worker.process.pid} is online`));
	// 进程退出时触发回调，接收(worker, code, signal)，code为进程退出代码，signal是系统终止进程的信号
	cluster.on('exit', (worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} exited with code ${code}`);
		cluster.fork();
	});

	for (let i = 0; i <= numWorkers; i++) {
		cluster.fork();
	}
} else {

	const responder = socket('rep');

	responder.on('message', data => {
		const request = JSON.parse(data);
		console.log(`${process.pid} received request for: ${request.path}`);

		readFile(request.path, (err, content) => {
			if (err) {
				throw err;
			}
			console.log(`${process.pid} sending response`);
			responder.send(JSON.stringify({
				content: content.toString(),
				timestamp: Date.now(),
				pid: process.pid
			}));
		});
	});

	responder.connect('ipc://filer-dealer.ipc');
}
