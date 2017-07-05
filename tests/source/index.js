'use strict';

const fs = require('fs');

const Source = require('../../src/source');


const ok = fn => (err, res) => err ? console.log(err) : fn(res);


Promise.resolve()
	
	// Enumerate files in 'cases' directory
	.then(() =>new Promise(
		res => fs.readdir(__dirname + '/cases', ok(res))
	))
	
	// Read all files from 'cases' directory
	.then(dir => Promise.all(
		dir.map(name => new Promise(
			res => fs.readFile(__dirname + '/cases/' + name, ok(
				data => res({name,data:data.toString()})
			))
		))
	))
	
	// Compile all sources
	.then(files => Promise.all(
		files.map(file => new Promise(
			res => res(new Source(file.data, file.name))
		))
	))
	
	// Write compiled files to 'out' directory
	.then(sources => Promise.all(
		sources.map(source => new Promise(
			res => fs.writeFile(
				__dirname + '/out/' + source.file.replace(/jc$/, 'json'),
				JSON.stringify(source.parsed, null, '  '),
				ok(res)
			)
		))
	))
	
	// Report extra errors
	.catch(err => console.log(err));

