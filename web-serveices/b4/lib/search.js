'use strict';

const request = require('request');

const rp = require('request-promise');

// express对象app，nconf提供的elasticsearch的配置es
exports = module.exports = (app, es) => {
	const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

	app.get('/api/search/books/:field/:query', (req, res) => {
		const {field, query} = req.params;
		const esReqBody = {
			size: 10,
			query: {
				match: {
					[field]: query
				}
			}
		};

		const options = {
			url,
			json: true,
			body: esReqBody
		};

		request.get(options, (err, esRes, esResBody) => {
			if (err) {
				res.status(502).json({
					error: 'bad_gateway',
					reason: err.code
				});
				return;
			}

			if (esRes.statusCode !== 200) {
				res.status(esRes.statusCode).json(esResBody);
				return;
			}
			res.status(200).json(esResBody.hits.hits.map(({_source}) => _source));
		});
	});

	app.get('/api/suggest/:field/:query', (req, res) => {
		const {field, query} = req.params;
		const esReqBody = {
			size: 0,
			suggest: {
				suggestions: {
					text: query,
					term: {
						field,
						suggest_mode: 'always'
					}
				}
			}
		};

		const options = {url, json: true, body: esReqBody};

		rp.get(options)
			.then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
			.catch(({error}) => res.status(error.statusCode || 502).json(error));
	});
};