#include operation.pegjs

param_list 'a static parameter list'
	= white_symbol? '(' __ p:params? __ ')' {return p || []}

params = a:param b:more_params* {return enlist(a, b)}
more_params = __ ',' p:param {return p}
param = __ p:prop_name {return p}


param_list_dynamic 'a dynamic parameter list'
	= white_symbol? '(' __ p:params_dynamic? __ ')' {return p || []}

params_dynamic = a:param_dynamic b:more_params_dynamic* {return enlist(a, b)}
more_params_dynamic = __ ',' p:param_dynamic {return p}
param_dynamic = __ type:prop_type name:prop_name {return {type,name}}


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


arg_list 'a list of arguments'
	= white_symbol* '(' __ a:args? __ ')'
	{return a || []}

args
	= a:expression b:more_args*
	{return enlist(a, b)}

more_args
	= __ ',' __ e:expression
	{return e}
