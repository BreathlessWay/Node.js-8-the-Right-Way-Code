const {readFileSync} = require('fs');
const {expect} = require('chai');

const parseRDF = require('../databases/lib/parse-rdf');

const rdf = readFileSync(`${__dirname}/pg132.rdf`);

describe('paresRDF', () => {
	it('should be a function', () => {
		const book = parseRDF(rdf);

		expect(book).to.be.an('object');

		expect(book).to.have.property('id', 132);

		expect(book).to.have.property('title', 'The Art of War');

		expect(book).to.have.property('authors')
			.that.is.an('array').with.lengthOf(2)
			.and.contains('Sunzi, active 6th century B.C.')
			.and.contains('Giles, Lionel');

		expect(book).to.have.property('subjects')
			.that.is.an('array').with.lengthOf(2)
			.and.contains('Military art and science -- Early works to 1800')
			.and.contains('War -- Early works to 1800');

		expect(book).to.have.property('lcc')
			.that.is.a('string')
			.and.have.length.of.at.least(1)
			.and.match(/^([A-H]|[J-N]|[P-V]|[Z])/);

		expect(book).to.have.property('downloads')
			.that.is.an('array')
			.and.to.have.length.of.at.least(1)
			.and.match(/^(http:\/\/www\.gutenberg\.org)/);
	});
});
