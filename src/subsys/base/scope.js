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
		if ( ! this._keys[k] ) {
			if (k.indexOf('.') === 0) {
				throw new Error(`Dynamic property not found in scope "${this._name}".`);
			}
			return k;
		}
		return this._keys[k];
	}
	
	
	set(k, v) {
		// console.log('SET', this._name, k, v);
		this._keys[k] = v;
	}
	
	
	chain(desc) {
		// console.log('CC:', JSON.stringify(desc, null, '\t'));
		const dot = desc.access === 'dynamic' ? '.' : '';
		
		let fullName = '';
		(function _recurse(subscope, chain, i) {
			
			if (i === chain.length) {
				return;
			}
			
			const next = subscope.get(`${( ! i && dot ) || ''}${chain[i]}`);
			
			if (typeof next === 'object') {
				fullName += `${(i && '.') || ''}${next.key}`;
				_recurse(next.scope, chain, i+1)
			} else {
				fullName += next;
			}
			
		})(this, desc.chain, 0);
		
		return fullName;
	}
	
};

module.exports = Scope;
