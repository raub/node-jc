'use strict';

const fs   = require('fs');
const path = require('path');

const libs = [];

module.exports = {
	
	require(file) {
		
		const resolved = resolve(file, libs);
		
		if ( ! resolved ) {
			throw new Error(`Can't locate sources for "${file}".`);
		}
		
		
	},
	
	libs(dir) {
		libs.push(dir);
	},
	
};
