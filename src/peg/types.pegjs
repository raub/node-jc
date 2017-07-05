
core_type  = core_char / core_int / core_float

core_char  = 'char'

core_int   = 'int2' / 'int3' / 'int4' / 'int'

core_float = 'float2' / 'float3' / 'float4' / 'float' 


struct_type "struct type"
	= type:core_type white_symbol? a:prop_name b:more_subs+
	{return { type, names: enlist(a, b) }}

more_subs "struct fields"
	= white_maybe ',' white_maybe name:prop_name
	{return name}


ref_type = list_type / class_type

list_type
	= target:class_name white_symbol* '[' white_symbol* ']'
	{return {target, type:'list'}}

class_type
	= target:class_name
	{return {target, type:'ref'}}
