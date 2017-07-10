'use strict';

const fs = require('fs');

const Source = require('../../src/source');


const ok = fn => (err, res) => err ? console.log(err) : fn(res);

/** Cases:
 * 
 * 1.  just-class      : an empty class
 * 2.  prop-dynamic    : a class with a dynamic property
 * 3.  prop-static     : a class with a static property
 * 4.  prop-external   : a class with an external property
 * 5.  method-dynamic  : a class with a dynamic method (empty)
 * 6.  method-static   : a class with a static method (empty)
 * 7.  prop-all        : a class with all kinds of properties
 * 8.  method-all      : a class with all kinds of methods (empty)
 * 9.  external-data   : external data of all kinds
 * 10. external-func   : external functions of all kinds
 * 11. gpu-code        : a gpu method with code
 * 12. static-default  : use of defaults for static props
 * 13. dynamic-struct  : use of struct types for dynamic structs
 * 14. multi-class     : multiple classes
 * 15. import-singular : singular import
 * 16. import-dual     : dual import
 * 17. import-multi    : multiple imports
 * 
 */



Promise.resolve()
	
	// Enumerate files in 'cases' directory
	.then(() =>new Promise(
		res => fs.readdir(__dirname + '/cases', ok(res))
	))
	
	// Read all files from 'cases' directory
	.then(dir => Promise.all(
		dir.map(name => new Promise(
			res => res(new Source(__dirname + '/cases/' + name))
		))
	))
	
	// Write parsed files to 'out' directory
	.then(sources => Promise.all(
		sources.map(source => new Promise(
			res => fs.writeFile(
				__dirname + '/out/parsed/' + source.name.replace(/jc$/, 'json'),
				JSON.stringify(source.parsed, null, '  '),
				ok(() => res(source))
			)
		))
	))
	
	// Write compiled files to 'out' directory
	.then(sources => Promise.all(
		sources.map(source => new Promise(
			res => fs.writeFile(
				__dirname + '/out/compiled/' + source.name.replace(/jc$/, 'cl'),
				(() => {
					return Object.keys(source.exported).map(k => {
						return `// ----> ${k} <---- //\n` + source.exported[k].toJSON();
					}).join('\n\n');
				})(),
				ok(() => res(source))
			)
		))
	))
	
	// Report extra errors
	.catch(err => console.log(err));

