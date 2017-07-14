
control = return / ctrl_branch / ctrl_loop
ctrl_branch = (ctrl_if / ctrl_switch) def_end
ctrl_loop = (ctrl_for / ctrl_while / ctrl_do) def_end

ctrl_if = __ 'if' __ '(' expression ')' (function_body_dynamic / operation) ctrl_else?
ctrl_else = __ 'else' (function_body_dynamic / operation)

ctrl_switch = __ 'switch' __ '(' __ expression __ ')' switch_body
switch_body = __ '{' switch_case* switch_default? switch_case* '}'
switch_case = __ 'case' white_symbol+ gpu_value define_op no_def_op* 'break' op_end
switch_default = __ 'default' define_op no_def_op* 'break' op_end

ctrl_for = __ 'for' for_constrain (function_body_dynamic / operation)
for_constrain = __ '(' loop_var? ';' __ expression __ ';' __ expression __ ')'
loop_var  = __ core_type one_local more_local? def_end

ctrl_while = __ 'while' '(' __ expression __ ')' (function_body_dynamic / operation)
ctrl_do = __ 'do' (function_body_dynamic / operation) 'while' '(' __ expression __ ')' 

return
	= __ 'return' value:return_value? op_end
	{return {type:'return', value}}
return_value = white_symbol+ value:expression {return value}
