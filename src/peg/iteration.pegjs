
iteration
	= iter:(iter_expr / iter_local) def_end
	{return iter}
iter_expr
	= __ target:expression __ '[' white_symbol* ']'
	  params:function_params_static_list
	  body:function_body_dynamic
	{return {type: 'iter_kernel', target, params, body}}
iter_local
	= __ '[' __ target:expression __ ']'
	  params:function_params_static_list
	  body:function_body_dynamic
	{return {type: 'iter_local', target, params, body}}



iteration_static_end 'the end of member definition'
	= (_s_ / ';')* &class_body_end? (comment_line / _n_)

iteration_static
	= e:expression_js
	  expression_js_end
	  params:function_params_static_list
	  body:function_body_dynamic
	  iteration_static_end
	{return {type:'kernel', e, params, body}}

expression_js = $( (!expression_js_end js_any)+ )
expression_js_end = _0_ '[' _0_ ']'
