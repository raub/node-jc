'use strict';

class Scope {
	
	constructor() {
		
		this._keys = {};
		
	}
	
	clone() {
		const cloned = new Scope();
		Object.keys(this._keys).forEach(k => {
			cloned._keys[k] = this._keys[k];
		});
		return cloned;
	}
	
	get(k) {
		return this._keys[k];
	}
	
	
	set(k, v) {
		this._keys[k] = v;
	}
	
};

module.exports = Scope;
