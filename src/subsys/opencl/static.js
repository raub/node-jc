'use strict';

// const device = require('./device');
// const types = require('./types');


class Static {
	
	get name()   { return this._name; }
	get code()   { return `${this._kernels}`; }
	
	
	constructor(desc, owner) {
		
		this._name  = desc.name;
		this._owner = owner;
		
		this._scope = owner.scope.clone(this._name);
		this._ownScope = this._scope.get(this._name);
		
		this._kernels = '';
		
		
	}
	
	
	invoke() {
		
	}
	
};

module.exports = Static;
