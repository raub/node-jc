
prop_type 'property type'
	= struct_type / core_type / ref_type / js_type


struct_type 'struct type'
	= type:core_type __ '{' __ a:prop_name b:more_subs+ __ '}'
	{return { type, names: enlist(a, b) }}

more_subs 'struct fields'
	= __ ',' __ name:prop_name
	{return name}


core_type  = core_void / core_char / core_uchar / core_int / core_uint / core_float

core_void  = 'void'

core_char  = 'char2'  / 'char3'  / 'char4'  / 'char'
core_uchar = 'uchar2' / 'uchar3' / 'uchar4' / 'uchar'

core_int   = 'int2'  / 'int3'  / 'int4'  / 'int'
core_uint  = 'uint2' / 'uint3' / 'uint4' / 'uint'

core_float = 'float2' / 'float3' / 'float4' / 'float' 


ref_type = list_type / class_type

list_type
	= target:class_name white_symbol* '[' white_symbol* ']'
	{return {target, type:'list'}}

class_type
	= target:class_name
	{return {target, type:'ref'}}


types_js = 'js'
js_type = 'js'

types_gpu = struct_type / core_type / ref_type

types_static = types_js / struct_type / core_type
