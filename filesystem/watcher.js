'use strict';

const fs = require('fs');

fs.watch('target.txt', (err, res) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log(res);
});

console.log('Now watching target.txt for changes...');
