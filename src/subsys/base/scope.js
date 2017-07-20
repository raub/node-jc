'use strict';

class Scope {
	
	get name() { return this._name; }
	
	get info()  { return this._info; }
	set info(v) { this._info = v;    }
	
	
	constructor(name) {
		
		this._name = name || this._randomName();
		this._keys = {};
		this._info = {};
		
	}
	
	
	_randomName() {
		return Math.floor(Math.random()*0xFFFF).toString(16);
	}
	
	
	clone(subName) {
		const cloned = new Scope();
		cloned._name = `${this._name}.${subName || this._randomName()}`;
		Object.keys(this._keys).forEach(k => {
			cloned._keys[k] = this._keys[k];
		});
		cloned._info = this._info;
		return cloned;
	}
	
	
	get(k) {
		return this._keys[k] || k;
	}
	
	
	set(k, v) {
		this._keys[k] = v;
	}
	
};

module.exports = Scope;
