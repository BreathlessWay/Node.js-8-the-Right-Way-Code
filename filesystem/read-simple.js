'use strict';

const fs = require('fs');

// error first
fs.readFile('target.txt', (err, data) => {
	if (err) {
		throw err;
	}
	console.log(data.toString('utf-8'));
});
