'use strict';

// const device = require('./device');
// const types = require('./types');

const Scope = require('../base/scope');


class Dynamic {
	
	get name()   { return this._name; }
	get header() { return `${this._signature};`; }
	get code()   { return `${this._signature} {${this._inject}\n\t${this._body}\n}`; }
	
	get inject()  { return this._inject; }
	set inject(v) { this._inject = v; }
	
	get attributes()  { return this._attributes; }
	set attributes(v) { this._attributes = v; }
	
	
	constructor(desc, scope) {
		
		this._name = desc.name;
		
		this._scope = scope.clone(this._name);
		this._ownScope = scope.get(this._name);
		
		const name = this._scope.get(`${this._name}`).name;
		
		this._signature = `${desc.type} ${name}${this._params(desc.params)}`;
		
		this._body = desc.body.map(statement => {
			const method = `__${statement.type}`;
			return this[method] && this[method](statement, scope) ||
				`// TODO: ${statement.type}`;
		}).join('\n\t');
		
		this._inject = '';
		
	}
	
	
	_params(desc) {
		return `(size_t _this_i_, __global char *_uniform_buffer_${
				this._attributes ? `, ${this._attributes}` : ''
			}${
				desc.length ? `, ${desc.map(v => {
					
					const name = `_${this._name}_param_${v.name}`;
					const ownScope = new Scope(name);
					// TODO: fillScope?
					this._scope.set(v.name, ownScope);
					
					return `${v.type} ${name}`;
					
				}).join(', ')
			}` : ''})`;
	}
	
	
	__vars(desc) {
		
		return desc.list.map(v => {
			
			const name = `_${this._name}_local_${v.name}`;
			const ownScope = new Scope(name);
			this._scope.set(v.name, ownScope);
			
			
			if (v.value) {
				return `${desc.typeName} ${name} = ${this.__expression(v.value)};`;
			} else {
				return `${desc.typeName} ${name};`;
			}
			
		}).join('\n');
		
	}
	
	
	_chain(desc) {
		const that = this;
		
		let fullName = '';
		(function _recurse(subscope, chain, i) {
			
			if (i === chain.length) {
				return;
			}
			
			const item = chain[i];
			const next = subscope.get(`${item.name}`);
			
			if (typeof next === 'object') {
				fullName += `${i ? '.' : ''}${next.name}`;
			} else if (typeof next === 'string') {
				fullName += `${i ? '.' : ''}${next}`;
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
		return `${this._chain(desc.callee)}${this.__args(desc.args)};`;
	}
	
	
	_args(desc) {
		return `(_this_i_, _uniform_buffer_${desc.length ? `, ${desc.map(e => this.__expression(e)).join(', ')}` : ''})`;
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
