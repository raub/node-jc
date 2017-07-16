'use strict';

// const device = require('./device');
// const types = require('./types');


class Uniform {
	
	get name()  { return this._name; }
	
	get value()  { return this._value; }
	set value(v) { this._value = v;    }
	
	get header() { return `${this._signature};`; }
	get code()   { return `${this._signature} {\n\t${this._body}\n}`; }
	get inject() { return this._inject; }
	
	constructor(desc, scope) {
		
		this._name = desc.name;
		this._scope = scope.clone(this._name);
		
		if (typeof desc.type === 'object') {
			//console.log('OOOOO', JSON.stringify(desc, null, '\t'));
			this._uniType  = desc.type.type;
			this._uniItems = desc.type.names.length;
		} else {
			this._uniType = desc.type;
		}
		
		this._value = desc.init;
		
		this._signature = `__global ${this._uniType} *_uniform_${this._scope.get(`${this._name}`)}()`;
		
		this._body = `__global static ${this._uniType} _uniform_stored_${this._scope.get(`${this._name}`)};\n`+
			`\treturn &_uniform_stored_${this._scope.get(`${this._name}`)};`;
		
		this._inject = `\t${this._uniType} ${this._scope.get(`${this._name}`)} = *_uniform_${this._scope.get(`${this._name}`)}();`;
		
	}
	
};

module.exports = Uniform;
