'use strict';

const device = require('./device');
const types = require('./types');
const Scope = require('../base/scope');


class Uniform {
	
	get name()  { return this._name; }
	
	get value()  { return this._value; }
	set value(v) { this._value = v; this._write(); }
	
	get header() { return `${this._signature};`; }
	get code()   { return `${this._signature} {\n\t${this._body}\n}`; }
	get inject() { return this._inject; }
	
	constructor(desc, scope) {
		
		this._name     = desc.name;
		this._scope    = scope.clone(this._name);
		this._ownScope = scope.get(this._name);
		
		if (typeof desc.type === 'object') {
			
			this._uniType  = desc.type.type;
			this._uniItems = desc.type.names.length;
			
			const typeScope = new Scope();
			types.fillScope(this._uniType, typeScope, this._scope);
			
			desc.type.names.forEach(
				n => this._ownScope.set(n, typeScope)
			);
			
		} else {
			
			this._uniType = desc.type;
			this._uniItems = 1;
			
			types.fillScope(this._uniType, this._ownScope, this._scope);
			
		}
		
		this._length = this._uniItems * types.sizeof(this._uniType);
		this._pos = device.uniforms.seize(this._length);
		
		this._array = new Uint8Array(this._length);
		
		this._value =  desc.init;
		this._write();
		
		const name = this._scope.get(`${this._name}`).name;
		
		this._signature = `${this._uniType} _uniform_${name}(__global char *_uniform_buffer_)`;
		
		this._body = `return *((__global ${this._uniType}*)(&_uniform_buffer_[${this._pos}]));`;
		
		this._inject = `\t${this._uniType} ${name} = _uniform_${name}(_uniform_buffer_);`;
		
	}
	
	_write() {
		const buffer = device.uniforms.buffer;
		device.cl.enqueueWriteBuffer(
			device.queue,
			buffer,
			true,
			this._pos,
			this._length,
			this._array
		);
	}
	
};

module.exports = Uniform;
