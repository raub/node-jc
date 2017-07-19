#include variable.pegjs
#include iteration.pegjs
#include expression.pegjs
#include chain.pegjs
#include control.pegjs

operation_dynamic = operation
operation_static  = operation

operation  = var_def_op / no_def_op
var_def_op = local_var
no_def_op  = assignment / iteration / control / action_only

action_only
	= __ chain:prop_chain op_end
	{return {type: 'action', chain}}

assignment = assign_atomic / assign_local

assign
	= __ op:assign_op __ value:expression
	{return {op,e}}
	
assign_only
	= default_op value:expression
	{return value}

assign_local
	= __ left:prop_chain __ operator:assign_op __ right:expression op_end
	{return {type:'assign',left,operator,right}}

assign_atomic
	= __ left:prop_chain __ operator:atomic_op __ right:expression op_end
	{return {type:'atomic',left,operator,right}}
