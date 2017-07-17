'use strict';

const device = require('./device');
const types = require('./types');


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
	get inject() { return this._inject; }
	
	constructor(desc, scope) {
		
		this._name = desc.name;
		this._scope = scope.clone(this._name);
		
		this._attrItems = 1;
		this._attrBytes = 4;
		this._attrType  = 'float';
		
		if (typeof desc.type === 'object') {
			this._attrType  = desc.type.type;
			this._attrItems = desc.type.names.length;
		} else {
			this._attrType = desc.type;
		}
		
		this._attrBytes = types.TYPE_SIZES[this._attrType] * this._attrItems;
		
		this._count = 0;
		
		this._buffer = device.cl.createBuffer(
			device.context,
			device.cl.MEM_READ_WRITE,
			this._attrBytes * types.CLASS_SIZE
		);
		
		this._signature = ``;
		
		this._body = ``;
		
		this._inject = ``;
		
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
