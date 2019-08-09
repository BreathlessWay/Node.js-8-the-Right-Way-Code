'use strict';

const assert = require('assert');
const {EventEmitter} = require('events');
const LDJClient = require('../lib/ldj-client');

describe('LDJClient', () => {
	let stream = null,
		client = null;

	beforeEach(() => {
		stream = new EventEmitter;
	});

	it('should emit a message event from a single data event', done => {
		client = new LDJClient(stream);

		client.on('message', message => {
			assert.deepStrictEqual(message, {foo: 'bar'});
			done();
		});

		stream.emit('data', `{"foo`);

		setTimeout(() => {
			stream.emit('data', `":`);
		}, 100);

		setTimeout(() => {
			stream.emit('data', `"bar"`);
		}, 200);

		setTimeout(() => {
			stream.emit('data', `}\n`);
		}, 200);

	});

	it('should throw error when get null', () => {
		// 接收(block, error, message)三个参数: error 参数不能是字符串。 如果第二个参数是字符串，则视为省略 error 参数，传入的字符串会被用于 message 参数。
		assert.throws(() => new LDJClient(null), /should not be null/);
	});

	it('不合法的json格式', done => {
		client = new LDJClient(stream);

		client.on('error', err => {
			assert.strictEqual('Unexpected end of JSON input', err.message);
			done();
		});

		stream.emit('data', `{"foo\n`);

	});

	it('结尾没有换行符，用close触发事件结束', done => {
		client = new LDJClient(stream);

		client.on('message', message => {
			assert.deepStrictEqual(message, {foo: 'bar'});
		});

		stream.emit('data', `{"foo"`);

		process.nextTick(() => {
			stream.emit('data', `: "bar"}`);
			stream.emit('close');
			done();
		});

	}).timeout(5000);

});
