'use strict';

const CLASS_SIZE = 1000000;

const SCALAR_SIZES = {
	float  : 4,
	int    : 4,
	uint   : 4,
	short  : 2,
	ushort : 2,
	char   : 1,
	uchar  : 1,
};


const getDimNumber = typeName => {
	
	// A core type, deduce ammount
	const dimString = typeName.replace(/^[a-z]/i, '');
	
	// Scalar type
	if ( ! dimString.length ) {
		return 1;
	}
	
	// Vector type
	const dimNumber = parseInt(dimString);
	if ( ! dimNumber ) {
		throw new Error(`The string "${typeName}" is not a valid type name.`);
	}
	
	return dimNumber;
	
};


const sizeof = typeName => {
	
	const typeBase = typeName.match(/^[a-z]/i)[0];
	
	// Not a core type
	if ( ! SCALAR_SIZES[typeBase] ) {
		return 4;
	}
	
	return getDimNumber(typeName) * SCALAR_SIZES[typeBase];
	
};


const fillScope = (typeName, scope, containerScope) => {
	
};


module.exports = {
	CLASS_SIZE,
	sizeof,
	fillScope,
};
