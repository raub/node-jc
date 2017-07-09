'use strict';

const resolve = require('./resolve');

const Source = require('./source');


const libs = [];

const cache = {};

module.exports = {
	
	require(name, _dir) {
		
		const resolved = resolve(name, libs, _dir);
		
		if ( ! resolved ) {
			throw new Error(`Can't locate sources for "${name}"${_dir ? ` in "${_dir}"` : ''}.`);
		}
		
		return resolved.reduce((prev, file) => {
			
			const source = cache[file] || (new Source(file));
			
			if (source.error) {
				throw new Error(source.error.toString());
			}
			
			if ( ! cache[file] ) {
				cache[file] = source;
			}
			
			if ( ! source.exported ) {
				return prev;
			}
			
			Object.keys(source.exported).forEach(k => {
				prev[k] = source.exported[k];
			});
			
			return prev;
			
		}, {});
		
	},
	
	
	libs(dir) {
		
		libs.push(dir);
		
	},
	
};
