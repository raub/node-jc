'use strict';

// const device = require('./device');
// const types = require('./types');

const Scope = require('../base/scope');


class Dynamic {
	
	get name()   { return this._name; }
	get header() { return `${this.signature};`; }
	get code()   {
		return `${this.signature} {${this._inject}\n\t${
			this._descBody.map(statement => {
				const method = `__${statement.type}`;
				return this[method] && this[method](statement, this._scope) ||
					`// TODO: ${statement.type}`;
			}).join('\n\t')
		}\n}`;
	}
	
	get inject()  { return this._inject; }
	set inject(v) { this._inject = v; }
	
	get attributeParams()  { return this._attributeParams; }
	set attributeParams(v) { this._attributeParams = v; }
	
	get attributeArgs()  { return this._attributeArgs; }
	set attributeArgs(v) { this._attributeArgs = v; }
	
	get signature() {
		this._paramList = this._paramList || this._params();
		return `${this._ownType} ${this._ownName}${this._paramList}`;
	}
	
	constructor(desc, scope) {
		
		this._name = desc.name;
		
		this._scope = scope.clone(this._name);
		this._ownScope = scope.get(this._name);
		
		this._ownName = this._scope.get(`${this._name}`).name;
		this._ownType = desc.type;
		
		this._descParams = desc.params;
		this._descBody = desc.body;
		
		this._body = 'BODY_NOT_READY';
		
		this._attributeParams = 'PARAMS_NOT_READY';
		this._attributeArgs = 'ARGS_NOT_READY';
		
	}
	
	
	_params() {
		const desc = this._descParams;
		return `(size_t _this_i_, __global char *_uniform_buffer_${
				this._attributeParams ? `, ${this._attributeParams}` : ''
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
				fullName += that._args(typeof next === 'object' ? next : null, item.args);
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
	
	
	// __call(desc) {
	// 	return `${this._chain(desc.callee)}${this.__args(desc.args)};`;
	// }
	
	
	_args(subscope, desc) {
		
		const attributes = subscope && subscope.info && subscope.info.owner &&
				this._scope.get(subscope.info.owner) &&
				this._scope.get(subscope.info.owner).info[subscope.info.owner].attributeArgs ||
			'';
		
		return `(_this_i_, _uniform_buffer_${
				attributes ?
					`, /*ARGS: ${this._ownScope.info.owner} */ ${attributes} /* END ARGS */` :
					`/* NO_ARGS: ${this._ownScope.info.owner} */`
			}${
				desc.length ?
					`, ${desc.map(e => this.__expression(e)).join(', ')}` :
					''
			})`;
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
