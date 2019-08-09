'use strict';

const {load} = require('cheerio');

const parseRDF = rdf => {
	const $ = load(rdf);
	debugger;
	const id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');

	const title = $('dcterms\\:title').text();

	const authors = $('pgterms\\:agent pgterms\\:name').toArray().map(ele => $(ele).text());

	const subjects = $('[rdf\\:resource$="/LCSH"]').parent().find('rdf\\:value').toArray().map(ele => $(ele).text());

	const lcc = $('dcam\\:memberOf[rdf\\:resource$="/LCC"]').parent().find('rdf\\:value').text();

	const downloads = $('pgterms\\:file').toArray().map(ele => $(ele).attr('rdf:about'));

	return {
		id,
		title,
		authors,
		subjects,
		lcc,
		downloads
	};
};

exports = module.exports = parseRDF;
