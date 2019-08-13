'use strict';

const express = require('express'),
	rp = require('request-promise');

const getUserKey = ({user: {provider, id}}) => `${provider}-${id}`;

exports = module.exports = (baseUrl) => {
	const url = new URL(baseUrl + '/bundle').href;
	const router = express.Router();

	router.use((req, res, next) => {
		if (!req.isAuthenticated()) {
			res.status(403).json({
				error: 'You must sign in to use this service'
			});
			return;
		}
		next();
	});

	router.get('/list-bundles', async (req, res) => {
		try {
			const esReqBody = {
				size: 1000,
				query: {
					match: {
						userKey: getUserKey(req)
					}
				}
			};
			const options = {
				url: `${url}/_search`,
				json: true,
				body: esReqBody
			};
			const esResBody = await rp(options);
			const bundles = esResBody.hits.hits.map(hit => ({
				id: hit._id,
				name: hit._source.name
			}));
			res.status(200).json(bundles);
		} catch (error) {
			res.status(error.statusCode || 502).json(error.error || err);
		}
	});

	router.post('/bundle', async (req, res) => {
		try {
			const bundle = {
				name: req.query.name || '',
				userKey: getUserKey(req),
				books: []
			};
			const esResBody = await rp.post({url, body: bundle, json: true});
			res.status(201).json(esResBody);
		} catch (error) {
			res.status(error.statusCode || 502).json(error.error || err);
		}
	});

	router.get('/bundle/:id', async (req, res) => {
		try {
			const options = {
				url: `${url}/${req.params.id}`,
				json: true
			};
			const {_source: bundle} = await rp(options);
			if (bundle.userKey !== getUserKey(req)) {
				throw {
					statusCode: 403,
					error: 'You are not authorized to view this bundle.'
				};
			}
			res.status(200).json({id: req.params.id, bundle});
		} catch (error) {
			res.status(error.statusCode || 502).json(error.error || err);
		}
	});

	router.delete('/bundle/:id', async (req, res) => {
		try {
			const options = {
				url: `${url}/${req.params.id}`,
				json: true
			};
			const esResBody = await rp.delete(options);

			res.status(200).json(esResBody);
		} catch (error) {
			res.status(error.statusCode || 502).json(error.error || err);
		}
	});

	return router;
};
