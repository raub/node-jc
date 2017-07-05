
iteration
	= iter:(iter_expr / iter_local) def_end
	{return iter}
iter_expr
	= __ target:expression __ '[' white_symbol* ']'
	  params:param_list
	  body:func_body
	{return {type: 'iter_kernel', target, params, body}}
iter_local
	= __ '[' __ target:expression __ ']'
	  params:param_list
	  body:func_body
	{return {type: 'iter_local', target, params, body}}
