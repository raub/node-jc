'use strict';

// const device = require('./device');
// const types = require('./types');

const Scope = require('../base/scope');


class DynamicChain {
	
	
	constructor(desc) {
		const that = this;
		
		let fullName = '';
		(function _recurse(subscope, chain, i) {
			
			if (i === chain.length) {
				return;
			}
			
			const item = chain[i];
			// if (!subscope) {
				
			// }
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
				//console.log('next', JSON.stringify(next, null, '\t'));
				_recurse(next, chain, i+1);
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
		
		const thiscall = subscope && subscope.info && subscope.info.owner;
		
		const attributes = subscope && subscope.info && subscope.info.owner &&
				this._scope.get(subscope.info.owner) &&
				this._scope.get(subscope.info.owner).info[subscope.info.owner].attributeArgs ||
			'';
		
		return `(${
				thiscall ? '_this_i_, _uniform_buffer_' : ''
			}${
				thiscall && attributes ? ', ' : ' '
			}${
				attributes ?
					`/*ARGS: ${this._ownScope.info.owner} */ ${attributes} /* END ARGS */` :
					`/* NO_ARGS: ${this._ownScope.info.owner} */`
			}${
				(thiscall || attributes) && desc.length ? ', ' : ' '
			}${
				desc.length ? desc.map(e => this.__expression(e)).join(', ') : ''
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

module.exports = DynamicChain;
