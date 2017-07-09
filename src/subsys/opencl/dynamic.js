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
		this._body = desc.body.map(statement => {
			return '';
		}).join('\n');
		
	}
	
	
	
};

module.exports = Dynamic;
