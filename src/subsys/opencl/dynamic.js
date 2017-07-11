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
		
		this._signature = `void ${this._scope.get(`.${this._name}`)}()`;
		
		this._body = desc.body.map(statement => {
			const method = `__${statement.type}`;
			return this[method] && this[method](statement, scope) ||
				`// ${statement.type}`;
		}).join('\n');
		
	}
	
	
	__vars(desc) {
		
		return desc.list.map(v => {
			this._scope.set(v.name, 'local_' + v.name);
			if (v.value) {
				return `${desc.typeName} ${this._scope.get(v.name)} = ${this.__expression(v.value)};`;
			} else {
				return `${desc.typeName} ${this._scope.get(v.name)};`;
			}
		}).join('\n');
		
	}
	
	
	__call(desc) {
		// console.log('CL:', JSON.stringify(desc, null, '\t'));
		return `${this._scope.chain(desc.callee)}${this.__args(desc.args)};`;
		
	}
	
	
	__args(desc) {
		return `(${desc.map(e => this.__expression(e)).join(', ')})`;
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
				if (that._name === 'pull') {
					console.log('RVAL', JSON.stringify(subexpr.a, null, '\t'),that._scope.chain(subexpr.a));
				}
				
				return `${typeof subexpr.a === 'string' ? subexpr.a : that._scope.chain(subexpr.a)}`;
			} else {
				throw new Error(
					`Unknown subexpression:\n${JSON.stringify(subexpr, null, '\t')}`
				);
			}
			
		})(desc);
		
	}
	
	
	__assign(desc) {
		return `${this._scope.chain(desc.left)} ${desc.operator
			} ${this.__expression(desc.right)};`;
	}
	
	
	__atomic(desc) {
		const op = ({ '+==': 'add', '-==': 'sub' })[desc.operator];
		return `atomic_${op}(&${this._scope.chain(desc.left)}, ${this.__expression(desc.right)});`;
	}
	
};

module.exports = Dynamic;
