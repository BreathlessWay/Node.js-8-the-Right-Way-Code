#!/usr/bin/env node

const {readFileSync} = require('fs');
const parseRDF = require('./lib/parse-rdf');

const rdf = readFileSync(process.argv[2]);

const book = parseRDF(rdf);

console.log(JSON.stringify(book, null, '    '));
