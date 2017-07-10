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
	
	chain(desc) {
		console.log('CC:', JSON.stringify(desc, null, '\t'));
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
