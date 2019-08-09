const fs = require('fs');
const {spawn} = require('child_process');
const [, , filename, cmd, ...args] = process.argv;

if (!filename) {
	throw new Error('A file to watch must be specified!');
}

fs.watch(filename, () => {
	const ls = spawn(cmd, [...args, filename]);
	let output = '';

	ls.stdout.on('data', chunk => output += chunk);

	ls.on('close', () => {
		console.log({output});
		const parts = output.split(/\s+/);
		console.log({parts});
		console.log(parts[0], parts[4], parts[8]);
	});

	ls.stdout.pipe(process.stdout);
});

console.log(`Now watching ${filename} for changes ...`);
