'use strict';

// const device = require('./device');
// const types = require('./types');


class Dynamic {
	
	get name()   { return this._name; }
	get code()   { return `${this._kernels}`; }
	
	
	constructor(device, desc, scope) {
		
		this._name = desc.name;
		
		this._scope = scope.clone(this._name);
		
		this._kernels = '';
		
		
	}
	
	
	
};

module.exports = Dynamic;
