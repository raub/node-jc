'use strict';

const CLASS_SIZE = 1000000;

const TYPE_SIZES = {
	
	'float'   : 4,
	'float2'  : 8,
	'float3'  : 12,
	'float4'  : 16,
	
	'int'     : 4,
	'int2'    : 8,
	'int3'    : 12,
	'int4'    : 16,
	
	'uint'    : 4,
	'uint2'   : 8,
	'uint3'   : 12,
	'uint4'   : 16,
	
	'char'    : 1,
	'char2'   : 2,
	'char3'   : 3,
	'char4'   : 4,
	
	'uchar'   : 1,
	'uchar2'  : 2,
	'uchar3'  : 3,
	'uchar4'  : 4,
	
	'short'   : 2,
	'short2'  : 4,
	'short3'  : 6,
	'short4'  : 8,
	
	'ushort'  : 2,
	'ushort2' : 4,
	'ushort3' : 6,
	'ushort4' : 8,
	
};

module.exports = {
	CLASS_SIZE,
	TYPE_SIZES,
};
