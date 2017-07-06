'use strict';

const fs   = require('fs');
const path = require('path');

// const Source = require('./source');


// const opts = {
	
// };

// require.extensions['.jc'] = function(module, name) {
// 	const data = fs.readFileSync(filename, 'utf8');
	
// 	const source = new Source(data, name);
	
// 	return module._compile(source.compiled, name);
// };


const mainDir = process.mainModule.filename.match(/^.*(?=\/)/)[0];

module.exports = {
	
	_libs: [],
	_exts: ['', '.jc'],
	
	_loadPath(fullPath) {
		const isFile = fs.statSync(fullPath).isFile();
		if (isFile && /\.js$/) {
			
		}
	},
	
	
	_checkPath(fullBase) {
		let fullPath = null;
		const found = this._exts.some(ext => {
			if (fs.existsSync(fullBase + ext)) {
				fullPath = fullBase + ext;
				return true;
			}
		});
		return fullPath;
	},
	
	
	require(file) {
		
		// 1. starts with "libs:" - look for lib
		if (/^libs\:/.test(file)) {
			const part = file.slice(5);
			let fullPath = null;
			const found = this.libs.some(dir => {
				fullPath = _check(path.resolve(mainDir, dir, part));
				return fullPath && true || false;
			});
			if (found) {
				return this._load(fullPath);
			}
		}
		
		// 2. starts with dot - look for local
		if (/^\./.test(file)) {
			let fullPath = null;
			const found = this.libs.some(dir => {
				fullPath = _check(path.resolve(mainDir, file));
				return fullPath && true || false;
			});
			if (found) {
				return this._load(fullPath);
			}
		}
		
		// 1. look for node modules
		
		// 3. look for local
		
		
		
		
	},
	
	libs(dir) {
		this._libs.push(dir);
	},
	
};
