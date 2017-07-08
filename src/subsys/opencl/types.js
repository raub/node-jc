'use strict';

const CLASS_SIZE = 1000000;

const TYPE_SIZES = {
	
	'float'   : 4,
	'float2'  : 8,
	'float3'  : 16, // hack, actually uses float4
	'float4'  : 16,
	
	'int'     : 4,
	'int2'    : 8,
	'int3'    : 16, // hack, actually uses int4
	'int4'    : 16,
	
	'uint'    : 4,
	'uint2'   : 8,
	'uint3'   : 16, // hack, actually uses uint4
	'uint4'   : 16,
	
	'char'    : 1,
	'char2'   : 2,
	'char3'   : 4, // hack, actually uses char4
	'char4'   : 4,
	
	'uchar'   : 1,
	'uchar2'  : 2,
	'uchar3'  : 4, // hack, actually uses uchar4
	'uchar4'  : 4,
	
	'short'   : 2,
	'short2'  : 4,
	'short3'  : 8, // hack, actually uses short4
	'short4'  : 8,
	
	'ushort'  : 2,
	'ushort2' : 4,
	'ushort3' : 8, // hack, actually uses ushort4
	'ushort4' : 8,
	
};

module.exports = {
	CLASS_SIZE,
	TYPE_SIZES,
};
