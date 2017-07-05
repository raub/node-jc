'use strict';

// const fs = require('fs');

// const Source = require('./source');


// const opts = {
	
// };

// require.extensions['.jc'] = function(module, name) {
// 	const data = fs.readFileSync(filename, 'utf8');
	
// 	const source = new Source(data, name);
	
// 	return module._compile(source.compiled, name);
// };




module.exports = {
	
	_libs: [],
	
	require(file) {
		
	},
	
	libs(dir) {
		this._libs.push(dir);
	},
	
};
