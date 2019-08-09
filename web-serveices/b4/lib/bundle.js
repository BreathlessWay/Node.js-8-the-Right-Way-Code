'use strict';

const rp = require('request-promise');

exports = module.exports = (app, es) => {

	const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;

	app.post('/api/bundle', (req, res) => {
		const bundle = {
			name: req.query.name || '',
			books: []
		};
		// fCUFb2wBW9eaV5gzOjk5
		rp.post({url, body: bundle, json: true})
			.then(esResBody => res.status(201).json(esResBody))
			.catch(({error}) => res.status(error.statusCode || '502').json(error));

	});

	app.get('/api/bundle/:id', async (req, res) => {
		const options = {
			url: `${url}/${req.params.id}`,
			json: true
		};

		try {
			const esResBody = await rp.get(options);
			res.status(200).json(esResBody);
		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr.error);
		}
	});

	app.put('/api/bundle/:id/name/:name', async (req, res) => {
		const {id, name} = req.params;

		const bundleUrl = `${url}/${id}`;

		try {
			let bundle = await rp.get({url: bundleUrl, json: true});
			bundle = bundle._source;
			bundle.name = name;

			const esResBody = await rp.put({url: bundleUrl, body: bundle, json: true});

			res.status(200).json(esResBody);
		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr);
		}
	});

	app.put('/api/bundle/:id/book/:pgid', async (req, res) => {

		const {id, pgid} = req.params;

		const bundleUrl = `${url}/${id}`;

		const bookUrl = `http://${es.host}:${es.port}/${es.books_index}/book/${pgid}`;

		try {
			const [bundleRes, bookRes] = await Promise.all([
				rp({url: bundleUrl, json: true}),
				rp({url: bookUrl, json: true})
			]);

			const {_source: bundle, _version: version} = bundleRes,
				{_source: book} = bookRes;

			const idx = bundle.books.findIndex(book => book.id === pgid);

			if (idx === -1) {
				bundle.books.push({
					id: pgid,
					title: book.title
				});
			}

			const esResBody = await rp.put({
				url: bundleUrl,
				qs: {version},
				body: bundle,
				json: true
			});

			res.status(200).json(esResBody);
		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr.error);
		}
	});

	app.delete('/api/bundle/:id', async (req, res) => {
		const bundleUrl = `${url}/${req.params.id}`;

		try {
			const esResBody = await rp.delete({
				url: bundleUrl,
				json: true
			});
			res.status(200).json(esResBody);
		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr.error);
		}
	});

	app.delete('/api/bundle/:id/book/:pgid', async (req, res) => {
		const {id, pgid} = req.params;
		const bundleUrl = `${url}/${id}`;

		try {
			const bundleRes = await rp.get({
				url: bundleUrl,
				json: true
			});

			const {_source: bundle, _version: version} = bundleRes,
				{books} = bundle;

			const _idx = books.findIndex(book => book.id === pgid);

			if (_idx === -1) {
				throw {
					statusCode: 409,
					error: 'No such book!'
				};
			}

			books.splice(_idx, 1);

			const esResBody = await rp.put({
				url: bundleUrl,
				qs: {version},
				body: bundle,
				json: true
			});

			res.status(200).json(esResBody);

		} catch (esResErr) {
			res.status(esResErr.statusCode || 502).json(esResErr.error);
		}

	});

};
