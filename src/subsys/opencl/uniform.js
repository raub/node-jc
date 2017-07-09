'use strict';

// const device = require('./device');
// const types = require('./types');


class Attribute {
	
	get name()  { return this._name;  }
	
	get value()  { return this._value; }
	set value(v) { this._value = v;    }
	
	
	constructor(desc) {
		
		this._name = desc.name;
		this._value = desc.init;
		
	}
	
};

module.exports = Attribute;
