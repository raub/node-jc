'use strict';


class UniformBuffer {
	
	get buffer() { return this._buffer; }
	get used() { return this._used; }
	
	constructor(cl, context, size) {
		
		size = size || 32000;
		
		this._buffer = cl.createBuffer(
			context,
			cl.MEM_READ_ONLY,
			size
		);
		
		this._used = 0;
		
	}
	
	seize(num) {
		const prev = this._used;
		this._used += num;
		return prev;
	}
	
}

module.exports = UniformBuffer;
