'use strict';

// const device = require('./device');
// const types = require('./types');


class Dynamic {
	
	get name()   { return this._name; }
	
	
	constructor(desc) {
		
		this._name = desc.name;
		
		
	}
	
	
	
};

module.exports = Dynamic;
