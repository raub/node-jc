'use strict';

// const device = require('./device');
// const types = require('./types');


class Dynamic {
	
	get name()   { return this._name; }
	get header() { return `${this._signature};`; }
	get code()   { return `${this._signature} {\n${this._body}\n}`; }
	
	
	constructor(desc, scope) {
		
		this._name = desc.name;
		
		this._scope = scope.clone(this._name);
		
		this._signature = `${desc.type} ${this._scope.get(`.${this._name}`)}()`;
		
		this._body = desc.body.map(statement => {
			const method = `__${statement.type}`;
			return this[method] && this[method](statement, scope) ||
				`// ${statement.type}`;
		}).join('\n');
		
	}
	
	
	__vars(desc) {
		
		return desc.list.map(v => {
			this._scope.set(v.name, `_${this._name}_local_${v.name}`);
			if (v.value) {
				return `${desc.typeName} ${this._scope.get(v.name)
					} = ${this.__expression(v.value)};`;
			} else {
				return `${desc.typeName} ${this._scope.get(v.name)};`;
			}
		}).join('\n');
		
	}
	
	
	_chain(desc) {
		const that = this;
		const dot = desc.access === 'dynamic' ? '.' : '';
		
		let fullName = '';
		(function _recurse(subscope, chain, i) {
			
			if (i === chain.length) {
				return;
			}
			
			const item = chain[i];
			
			const next = (() => {
				// console.log('CHA', JSON.stringify(chain, null, '\t'));
				if (i === 0) {
					return subscope.get(`${dot}${item.name}`);
				} else {
					try {
						return subscope.get(`.${item.name}`);
					} catch (ex) {
						return subscope.get(`${item.name}`);
					}
				}
			})();
			
			if (typeof next === 'object') {
				fullName += `${i ? '.' : ''}${next.key}`;
			} else {
				fullName += next;
			}
			
			if (item.type === 'call') {
				fullName += that._args(item.args);
			} else if (item.type === 'index') {
				fullName += that._index(item.index, fullName);
			}
			
			
			if (typeof next === 'object') {
				_recurse(next.scope, chain, i+1);
			}
			
		})(this._scope, desc.chain, 0);
		return fullName;
	}
	
	
	__action(desc) {
		return `${this._chain(desc.chain)};`;
	}
	
	
	__call(desc) {
		// console.log('CL:', JSON.stringify(desc, null, '\t'));
		return `${this._chain(desc.callee)}${this.__args(desc.args)};`;
		
	}
	
	
	_args(desc) {
		return `(${desc.map(e => this.__expression(e)).join(', ')})`;
	}
	
	
	_index(desc, fullName) {
		const idx = this.__expression(desc.i);
		if ( ! desc.round ) {
			return `[${idx}]`;
		} else {
			return `[(${idx}) % ${fullName}]`;
		}
	}
	
	__expression(desc) {
		
		const that = this;
		
		return (function _recurse(subexpr) {
			
			// FIXME: add braces ( ) if needed
			
			if (subexpr.type === 'duo') {
				return `${_recurse(subexpr.a)} ${subexpr.duo} ${_recurse(subexpr.b)}`;
			} else if (subexpr.type === 'uno') {
				return `${subexpr.uno || ''}${_recurse(subexpr.a)}`;
			} else if (subexpr.type === 'rvalue') {
				return `${typeof subexpr.a === 'string' ? subexpr.a : that._chain(subexpr.a)}`;
			} else {
				throw new Error(
					`Unknown subexpression:\n${JSON.stringify(subexpr, null, '\t')}`
				);
			}
			
		})(desc);
		
	}
	
	
	__assign(desc) {
		return `${this._chain(desc.left)} ${desc.operator
			} ${this.__expression(desc.right)};`;
	}
	
	
	__atomic(desc) {
		const op = ({ '+==': 'add', '-==': 'sub' })[desc.operator];
		return `atomic_${op}(&${this._chain(desc.left)
			}, ${this.__expression(desc.right)});`;
	}
	
};

module.exports = Dynamic;
