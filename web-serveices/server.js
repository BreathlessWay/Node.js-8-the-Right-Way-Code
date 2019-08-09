'use strict';

const http = require('http');

const server = http.createServer((req, res) => {
	res.writeHead(200, {'content-type': 'text/plain'});
	res.end('Hello Http\n');
});

server.listen(60700, () => {
	console.log('Server is working on http://localhost:60700');
});
