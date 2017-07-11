
local_var
	= __ typeName:(core_type / class_type) a:one_local b:more_local? op_end
	{return {type: 'vars', typeName, list:enlist(a,b)}}
one_local
	= __ name:prop_name value:assign_only?
	{return {name, value}}
more_local
	= __ ',' __ v:one_local
	{return v}
