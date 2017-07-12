'use strict';

class Scope {
	
	get name() { return this._name; }
	
	
	constructor(name) {
		
		this._name = name || this._randomName();
		this._keys = {};
		
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
		return cloned;
	}
	
	
	get(k) {
		if ( this._keys[k] === undefined ) {
			if (k.indexOf('.') === 0) {
				throw new Error(`Dynamic property "${k}" not found in scope "${this._name}".`);
			}
			return k;
		}
		return this._keys[k];
	}
	
	
	set(k, v) {
		// console.log('SET', this._name, k, v);
		this._keys[k] = v;
	}
	
};

module.exports = Scope;
