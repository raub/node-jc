#include operation.pegjs

param_list 'a parameter list'
	= white_symbol? '(' __ p:params? __ ')' {return p || []}

params = a:param b:more_params* {return enlist(a, b)}
more_params = __ ',' p:param {return p}
param = __ p:prop_name {return p}


func_body = func_empty / func_not_empty

func_not_empty
	= __ func_body_start __ o:operation+ __ func_body_end
	{return o}

func_empty 'an empty function body'
	= __ func_body_start __ func_body_end
	{return []}

func_body_start 'a { before function body'
	= '{'
func_body_end 'a } after function body'
	= '}'


call_only
	= __ c:call op_end
	{return c}

call
	= callee:lvalue_prop_chain args:arg_list
	{return {type: 'call', callee, args}}

arg_list 'a list of arguments'
	= white_symbol* '(' __ a:args? __ ')'
	{return a || []}

args
	= a:expression b:more_args*
	{return enlist(a, b)}

more_args
	= __ ',' __ e:expression
	{return e}
