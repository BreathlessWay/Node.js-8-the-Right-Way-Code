const {EventEmitter} = require('events');

class LDJClient extends EventEmitter {
	constructor(stream) {
		super();

		if (stream === null) {
			throw new Error('should not be null');
		}

		let buffer = '';
		stream.on('data', data => {
			buffer += data;
			let boundary = buffer.indexOf('\n');
			while (boundary !== -1) {
				const input = buffer.substring(0, boundary);
				buffer = buffer.substring(boundary + 1);
				try {
					this.emit('message', JSON.parse(input));
				} catch (e) {
					this.emit('error', e);
				}
				boundary = buffer.indexOf('\n');
			}
		});

		stream.on('close', () => {
			this.emit('message', JSON.parse(buffer));
		});

	}

	static connect(stream) {
		return new LDJClient(stream);
	}
}

module.exports = LDJClient;
