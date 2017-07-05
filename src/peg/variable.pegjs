
local_var
	= __ type:(core_type / class_type) a:one_local b:more_local? op_end
	{return {type,vars:enlist(a,b)}}
one_local
	= __ name:prop_name value:assign?
	{return {name,value}}
more_local
	= __ ',' __ v:one_local
	{return v}
