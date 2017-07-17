'use strict';

const device = require('./device');
const types = require('./types');


class Uniform {
	
	get name()  { return this._name; }
	
	get value()  { return this._value; }
	set value(v) { this._value = v; this._write(); }
	
	get header() { return `${this._signature};`; }
	get code()   { return `${this._signature} {\n\t${this._body}\n}`; }
	get inject() { return this._inject; }
	
	constructor(desc, scope) {
		
		this._name = desc.name;
		this._scope = scope.clone(this._name);
		
		if (typeof desc.type === 'object') {
			this._uniType  = desc.type.type;
			this._uniItems = desc.type.names.length;
		} else {
			this._uniType = desc.type;
			this._uniItems = 1;
		}
		this._length = this._uniItems * types.TYPE_SIZES[this._uniType];
		this._pos = device.uniforms.seize(this._length);
		
		this._value =  new Float32Array([desc.init]);
		this._write();
		
		this._signature = `${this._uniType} _uniform_${this._scope.get(`${this._name}`)}(__global char *_uniform_buffer_)`;
		
		this._body = `return *((__global ${this._uniType}*)(&_uniform_buffer_[${this._pos}]));`;
		
		this._inject = `\t${this._uniType} ${this._scope.get(`${this._name}`)} = _uniform_${this._scope.get(`${this._name}`)}(_uniform_buffer_);`;
		
	}
	
	_write() {
		const buffer = device.uniforms.buffer;
		device.cl.enqueueWriteBuffer(
			device.queue,
			buffer,
			true,
			this._pos,
			this._length,
			this._value
		);
	}
	
};

module.exports = Uniform;
