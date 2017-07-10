'use strict';

// const device = require('./device');
// const types = require('./types');


class Dynamic {
	
	get name()   { return this._name; }
	get header() { return `${this._signature};`; }
	get code()   { return `${this._signature} {\n${this._body}\n}`; }
	
	
	constructor(desc) {
		
		this._name = desc.name;
		
		this._signature = `void ${this._name}()`;
		
		const scope = {};
		
		this._body = desc.body.map(statement => {
			const method = `__${statement.type}`;
			return this[method] && this[method](statement, scope) ||
				`// ${statement.type}`;
		}).join('\n');
		
	}
	
	
	__vars(desc, scope) {
		
		return desc.list.map(v => {
			return `${desc.typeName} ${v.name};`;
		}).join('\n');
		
	}
	
	
	__call(desc, scope) {
		// console.log('CL:', JSON.stringify(desc, null, '\t'));
		return `${this.__lvalue(desc.callee, scope)}${this.__args(desc.args, scope)};`;
		
	}
	
	
	__lvalue(desc, scope) {
		// console.log('LV:', JSON.stringify(desc, null, '\t'));
		const dot = desc.access === 'dynamic' ? '.' : '';
		const chain = desc.chain.join('.');
		return `${dot}${chain}`;
	}
	
	
	__args(desc, scope) {
		return `(${desc.map(e => this.__expression(e)).join(', ')})`;
	}
	
	
	__expression(desc, scope) {
		return '1';
	}
	
	
	__assign(desc, scope) {
		return `${this.__lvalue(desc.callee, scope)} ${desc.operator} ${this.__expression(desc.right, scope)};`;
	}
	
	
	__atomic(desc, scope) {
		const op = ({ '+==': 'add', '-==': 'sub' })[desc.operator];
		return `atomic_${op}(&${this.__lvalue(desc.callee, scope)}, ${this.__expression(desc.right, scope)});`;
	}
	
};

module.exports = Dynamic;
