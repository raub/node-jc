'use strict';

const device = require('./device');
const types = require('./types');
const Scope = require('../base/scope');


class Attribute {
	
	get name()   { return this._name; }
	get buffer() { return this._buffer; }
	
	get attrItems() { return this._attrItems; }
	get attrBytes() { return this._attrBytes; }
	get attrType()  { return this._attrType;  }
	
	get limit() { return types.CLASS_SIZE; }
	get count() { return this._count;      }
	
	get bytes() {
		return this._count * this._attrBytes;
	}
	
	get header() { return ``; }
	get code()   { return ``; }
	get param() { return this._param; }
	
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
		
		// this._name = desc.name;
		
		// this._scope    = scope.clone(this._name);
		// this._ownScope = scope.get(this._name);
		
		// if (typeof desc.type === 'object') {
		// 	this._attrType  = desc.type.type;
		// 	this._attrItems = desc.type.names.length;
		// } else {
		// 	this._attrType = desc.type;
		// }
		
		// this._attrBytes = types.sizeof(this._attrType) * this._attrItems;
		
		this._uniBytes = this._uniItems * types.sizeof(this._uniType);
		
		this._count = 0;
		
		this._buffer = device.cl.createBuffer(
			device.context,
			device.cl.MEM_READ_WRITE,
			this._uniBytes * types.CLASS_SIZE
		);
		
		const name = this._scope.get(`${this._name}`).name;
		
		this._param = `global ${this._uniType} *${name}`;
		
	}
	
	
	write(jsArray) {
		device.cl.enqueueWriteBuffer(
			device.queue, this._buffer, true,
			0, jsArray.length*jsArray.BYTES_PER_ELEMENT,
			jsArray
		);
	}
	
	
	read(jsArray) {
		device.cl.enqueueReadBuffer(
			device.queue, this._buffer, true,
			0, Math.min(jsArray.length*jsArray.BYTES_PER_ELEMENT, this._bytes),
			jsArray
		);
	}
	
	
};

module.exports = Attribute;
