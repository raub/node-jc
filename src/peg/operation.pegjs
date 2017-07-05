#include variable.pegjs
#include iteration.pegjs
#include expression.pegjs
#include chain.pegjs
#include control.pegjs

operation  = var_def_op / no_def_op
var_def_op = local_var
no_def_op  = assignment / call_only / iteration / control

assignment
	= __ left:prop_chain right:assign op_end
	{return {type:'assignment',left,operator:right.op,right:right.e}}
assign
	= __ op:assign_op __ e:expression
	{return {op,e}}
